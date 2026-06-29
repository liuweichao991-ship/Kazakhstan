/**
 * Products Page
 * Displays all products with filtering options
 */

import { createLayout } from "./layout";

export async function productsPage(env) {
  // Load settings from KV for SEO
  let siteName = "B2B Product Exhibition";
  let settings = null;
  try {
    const settingsJson = await env.STATIC_ASSETS.get("website_settings");
    if (settingsJson) {
      settings = JSON.parse(settingsJson);
      siteName = settings.site_name || siteName;
    }
  } catch (error) {
    console.error("Error loading settings for SEO:", error);
  }

  // Fetch active products with slugs for ItemList schema
  let activeProducts = [];
  try {
    const { results } = await env.DB.prepare(`
      SELECT p.id, p.name, s.slug
      FROM products p
      LEFT JOIN product_slugs s ON p.id = s.product_id
      WHERE p.is_active = 1
      ORDER BY p.created_at DESC
    `).all();
    activeProducts = results || [];
  } catch (error) {
    console.error("Error fetching products for ItemList schema:", error);
  }

  // Generate SEO tags
  let seoTags = "";
  try {
    const { URLManager } = await import("../seo/url-manager");
    const { MetaTagManager } = await import("../seo/meta-manager");
    const { SchemaGenerator } = await import("../seo/schema-generator");

    const urlManager = new URLManager(env);
    const metaManager = new MetaTagManager(env);
    const schemaGenerator = new SchemaGenerator(env);

    const canonicalUrl = urlManager.generateCanonicalUrl("/products");

    // Meta tags
    const metaTagsHtml = metaManager.generateMetaTags({
      title: `Products - ${siteName}`,
      description: `Browse our comprehensive range of high-quality products - ${siteName}`,
      canonicalUrl,
      imageUrl: null,
      pageType: "website",
    });

    // Breadcrumbs schema
    const breadcrumbs = [
      { name: "Home", url: "/" },
      { name: "Products", url: "/products" },
    ];
    const breadcrumbSchemaHtml = schemaGenerator.generateBreadcrumbSchema(breadcrumbs);

    // ItemList schema
    const itemListSchemaHtml = schemaGenerator.generateItemListSchema(activeProducts, canonicalUrl);

    // Parse and combine schemas
    const parseSchemaHtml = (html) => {
      if (!html) return null;
      const match = html.match(/<script[^>]*>([\s\S]*?)<\/script>/);
      try {
        return match ? JSON.parse(match[1].trim()) : null;
      } catch (e) {
        return null;
      }
    };

    const breadcrumbSchemaObj = parseSchemaHtml(breadcrumbSchemaHtml);
    const itemListSchemaObj = parseSchemaHtml(itemListSchemaHtml);

    const combinedSchemaHtml = schemaGenerator.generateMultiSchema([
      breadcrumbSchemaObj,
      itemListSchemaObj,
    ].filter(Boolean));

    seoTags = `${metaTagsHtml}\n  ${combinedSchemaHtml}`;
  } catch (seoError) {
    console.error("Error generating products page SEO tags:", seoError);
  }

  const content = `
    <!-- Products Section -->
    <div class="container" style="margin-top: 1.5rem; margin-bottom: 3rem; display: grid; grid-template-columns: 240px 1fr; gap: 2rem;" id="products-page-layout">
      <!-- Left Sidebar (Filters) -->
      <aside style="background: white; padding: 1.25rem; border-radius: 4px; border: 1px solid #ddd; height: fit-content;">
        <h2 style="font-size: 1.1rem; font-weight: 700; margin-bottom: 1rem; padding-bottom: 0.5rem; border-bottom: 1px solid #eee;">Filters</h2>
        
        <div class="form-group" style="margin-bottom: 1.5rem;">
          <label class="form-label" style="font-size: 0.85rem; text-transform: uppercase; color: var(--text-light); letter-spacing: 0.05em;">Search Keyword</label>
          <div style="display: flex; gap: 0.25rem;">
            <input
              type="text"
              id="search-input"
              placeholder="Keyword..."
              class="form-input"
              style="padding: 0.4rem 0.6rem; font-size: 0.85rem;"
            />
            <button id="search-btn" class="btn btn-primary" style="padding: 0.4rem 0.8rem; border-radius: 3px; font-size: 0.85rem; box-shadow: none;">Go</button>
          </div>
        </div>

        <div class="form-group">
          <label class="form-label" style="font-size: 0.85rem; text-transform: uppercase; color: var(--text-light); letter-spacing: 0.05em; margin-bottom: 0.5rem;">Departments</label>
          <select id="category-filter" class="form-input" style="padding: 0.4rem 0.6rem; font-size: 0.85rem;">
            <option value="">All Categories</option>
            <!-- Categories will be loaded dynamically -->
          </select>
        </div>

        <div style="margin-top: 1.5rem; font-size: 0.8rem; color: var(--text-light); line-height: 1.4;">
          <div style="font-weight: 600; color: var(--text-dark); margin-bottom: 0.25rem;">Supplier Profile</div>
          <label style="display: flex; align-items: center; gap: 0.4rem; cursor: pointer;">
            <input type="checkbox" checked disabled> Verified B2B Trader
          </label>
        </div>
      </aside>

      <!-- Right Column (Products & Title) -->
      <div>
        <div style="background: white; padding: 1rem 1.5rem; border-radius: 4px; border: 1px solid #ddd; margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
          <div>
            <h1 style="font-size: 1.3rem; font-weight: 700; margin: 0; color: var(--text-dark);">Wholesale Catalog</h1>
            <p style="font-size: 0.82rem; color: var(--text-light); margin: 0;">Explore high-density Sino-Kazakh garments trade inventory</p>
          </div>
          <div style="font-size: 0.82rem; color: var(--text-light); font-weight: 600;" id="results-count">Loading results...</div>
        </div>

        <!-- Products Grid -->
        <div id="products-container" class="grid grid-3">
          <div class="spinner"></div>
        </div>

        <!-- Pagination -->
        <div id="pagination-container" style="display: none; margin-top: 2rem;"></div>

        <!-- No Results Message -->
        <div id="no-results" style="display: none; text-align: center; padding: 3rem; background: white; border-radius: 4px; border: 1px solid #ddd;">
          <p style="color: var(--text-light); font-size: 1.1rem; font-weight: 500;">No products found matching your criteria.</p>
        </div>
      </div>
    </div>
  `;

  const scripts = `
    <script>
      let allProducts = [];
      let currentPage = 1;
      const itemsPerPage = 9; // Display in perfect multiples of 3 (Amazon grid)

      // Load categories dynamically
      function loadCategories(products) {
        const categories = [...new Set(products.map(p => p.category_name).filter(c => c))].sort();
        const categoryFilter = document.getElementById('category-filter');

        // Keep "All Categories" option and add dynamic categories
        categories.forEach(category => {
          const option = document.createElement('option');
          option.value = category;
          option.textContent = category;
          categoryFilter.appendChild(option);
        });
      }

      // Load all products
      async function loadProducts() {
        try {
          const response = await API.get('/products');
          allProducts = response.data || [];
          loadCategories(allProducts);
          
          // Parse query string parameters for search integration
          const urlParams = new URLSearchParams(window.location.search);
          const q = urlParams.get('q') || '';
          const category = urlParams.get('category') || '';
          
          if (q) {
            document.getElementById('search-input').value = q;
          }
          if (category) {
            document.getElementById('category-filter').value = category;
          }
          
          currentPage = 1;
          
          if (q || category) {
            filterProducts();
          } else {
            displayProducts(allProducts);
          }
        } catch (error) {
          console.error('Error loading products:', error);
          document.getElementById('products-container').innerHTML =
            '<p style="text-align: center; color: var(--text-light); grid-column: 1/-1;">Unable to load products. Please try again later.</p>';
        }
      }

      // Render pagination
      function renderPagination(totalProducts) {
        const totalPages = Math.ceil(totalProducts / itemsPerPage);
        const paginationContainer = document.getElementById('pagination-container');
        
        if (totalPages <= 1) {
          paginationContainer.style.display = 'none';
          return;
        }
        
        paginationContainer.style.display = 'block';
        let html = '<div style="display: flex; justify-content: center; gap: 0.5rem; flex-wrap: wrap;">';
        
        // Previous button
        if (currentPage > 1) {
          html += '<button onclick="goToPage(' + (currentPage - 1) + ')" class="btn btn-primary" style="padding: 0.5rem 1rem; border-radius: 4px;">← Previous</button>';
        }
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
          if (i === currentPage) {
            html += '<button style="padding: 0.5rem 1rem; background: var(--bg-menu); color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: 600;">' + i + '</button>';
          } else {
            html += '<button onclick="goToPage(' + i + ')" style="padding: 0.5rem 1rem; background: #e5e7eb; color: var(--text-dark); border: none; border-radius: 4px; cursor: pointer;">' + i + '</button>';
          }
        }
        
        // Next button
        if (currentPage < totalPages) {
          html += '<button onclick="goToPage(' + (currentPage + 1) + ')" class="btn btn-primary" style="padding: 0.5rem 1rem; border-radius: 4px;">Next →</button>';
        }
        
        html += '</div>';
        paginationContainer.innerHTML = html;
      }

      // Go to specific page
      function goToPage(page) {
        currentPage = page;
        const category = document.getElementById('category-filter').value;
        const searchTerm = document.getElementById('search-input').value.toLowerCase();

        const filtered = allProducts.filter(product => {
          const matchesCategory = !category || product.category_name === category;
          const matchesSearch = !searchTerm ||
            product.name.toLowerCase().includes(searchTerm) ||
            (product.description && product.description.toLowerCase().includes(searchTerm));

          return matchesCategory && matchesSearch;
        });

        displayProducts(filtered);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }

      // Display products
      function displayProducts(products) {
        const container = document.getElementById('products-container');
        const noResults = document.getElementById('no-results');
        const resultsCountEl = document.getElementById('results-count');

        if (products.length === 0) {
          container.innerHTML = '';
          noResults.style.display = 'block';
          document.getElementById('pagination-container').style.display = 'none';
          if (resultsCountEl) resultsCountEl.textContent = '0 results';
          return;
        }

        noResults.style.display = 'none';
        
        // Calculate pagination
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const paginatedProducts = products.slice(startIndex, endIndex);

        if (resultsCountEl) {
          resultsCountEl.textContent = 'Showing ' + (startIndex + 1) + '-' + Math.min(endIndex, products.length) + ' of ' + products.length + ' results';
        }

        container.innerHTML = paginatedProducts.map(product => {
          const price = product.price !== null && product.price !== undefined
            ? '$' + parseFloat(product.price).toFixed(2)
            : 'Inquire for Price';
            
          return \`
          <div class="card" style="box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-radius: 4px; border: 1px solid #ddd; background: white; display: flex; flex-direction: column;">
            <div style="position: relative;">
              <img src="\${getImageKitUrl(product.image_url, 'w-400,h-300,cm-pad_resize,bg-FFFFFF') || 'https://via.placeholder.com/400x300?text=No+Image'}" 
                   alt="\${product.name}" 
                   class="card-image" 
                   onerror="this.src='https://via.placeholder.com/400x300?text=Image+Not+Found'"
                   style="height: 180px; width: 100%; object-fit: contain; padding: 0.5rem; background: #ffffff;">
              <span style="position: absolute; top: 8px; left: 8px; background: #232f3e; color: white; padding: 0.15rem 0.5rem; font-size: 0.68rem; font-weight: 700; border-radius: 2px; text-transform: uppercase;">
                \${product.category_name || 'General'}
              </span>
            </div>
            
            <div class="card-content" style="padding: 0.85rem; display: flex; flex-direction: column; flex: 1;">
              <h3 class="card-title" style="font-size: 0.95rem; font-weight: 600; line-height: 1.3; margin: 0 0 0.25rem; height: 2.6em; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">
                \${product.name}
              </h3>
              
              <!-- Star Rating Placeholder -->
              <div style="display: flex; align-items: center; gap: 0.2rem; font-size: 0.75rem; margin-bottom: 0.4rem;">
                <span style="color: #ff9900; font-size: 0.85rem;">★★★★★</span>
                <span style="color: #007185; font-weight: 500;">5.0</span>
                <span style="color: var(--text-light);">(verified)</span>
              </div>

              <!-- Price section -->
              <div style="margin-bottom: 0.6rem;">
                <span style="font-size: 1.15rem; font-weight: 700; color: #0f1111;">\${price}</span>
                <span style="font-size: 0.72rem; color: #565959; display: block; font-weight: 500;">Bulk Wholesale Pricing</span>
              </div>

              <!-- Verified B2B Badge -->
              <div style="display: flex; align-items: center; gap: 0.2rem; font-size: 0.72rem; color: #007600; font-weight: 600; margin-bottom: 0.75rem;">
                <svg width="11" height="11" viewBox="0 0 20 20" fill="currentColor" style="display: inline-block;"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
                <span>Trade Assurance</span>
              </div>

              <div style="margin-top: auto;">
                <a href="/products/\${product.id}" class="btn btn-secondary" style="width: 100%; border-radius: 4px; padding: 0.45rem; font-size: 0.82rem; font-weight: 600;">View Details</a>
              </div>
            </div>
          </div>
          \`;
        }).join('');

        // Show pagination if needed
        renderPagination(products.length);
      }

      // Filter products
      function filterProducts() {
        currentPage = 1;
        const category = document.getElementById('category-filter').value;
        const searchTerm = document.getElementById('search-input').value.toLowerCase();

        const filtered = allProducts.filter(product => {
          const matchesCategory = !category || product.category_name === category;
          const matchesSearch = !searchTerm ||
            product.name.toLowerCase().includes(searchTerm) ||
            (product.description && product.description.toLowerCase().includes(searchTerm));

          return matchesCategory && matchesSearch;
        });

        displayProducts(filtered);
      }

      // Event listeners
      document.getElementById('category-filter').addEventListener('change', filterProducts);
      document.getElementById('search-input').addEventListener('input', filterProducts);
      document.getElementById('search-btn').addEventListener('click', filterProducts);

      // Allow Enter key to search
      document.getElementById('search-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          filterProducts();
        }
      });

      // Load products on page load
      loadProducts();

      // Add styles for layout responsive and card grid
      const productsStyle = document.createElement('style');
      productsStyle.textContent = \`
        @media (max-width: 768px) {
          #products-page-layout {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
        }
      \`;
      document.head.appendChild(productsStyle);
    </script>
  `;

  const html = createLayout(
    `Products - ${siteName}`,
    content,
    scripts,
    `Browse our comprehensive range of high-quality products - ${siteName}`,
    false, // Don't use title suffix, we already included site name
    seoTags,
    settings,
  );

  return new Response(html, {
    headers: {
      "Content-Type": "text/html;charset=UTF-8",
    },
  });
}
