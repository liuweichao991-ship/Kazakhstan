/**
 * Home Page
 * Displays company introduction and featured products
 */

import { createLayout } from "./layout";

export async function homePage(env) {
  // Load settings from KV for SEO
  let settings = {
    site_name: "B2B Product Exhibition",
    site_description:
      "We are a professional wholesale company in Kazakhstan specializing in Chinese knitted garments, building a bridge for Sino-Kazakh knitting trade.",
    company_intro:
      "We are a professional wholesale enterprise in Kazakhstan founded by senior Chinese knitted garment practitioners, dedicated to providing cost-effective, diversified Chinese knitted products to fill local market gaps.",
  };

  try {
    const settingsJson = await env.STATIC_ASSETS.get("website_settings");
    if (settingsJson) {
      const savedSettings = JSON.parse(settingsJson);
      settings = { ...settings, ...savedSettings };
    }
  } catch (error) {
    console.error("Error loading settings for SEO:", error);
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

    const canonicalUrl = urlManager.generateCanonicalUrl("/");

    // Meta tags
    const metaTagsHtml = metaManager.generateMetaTags({
      title: settings.site_name,
      description: settings.site_description,
      canonicalUrl,
      imageUrl: null,
      pageType: "website",
    });

    // Organization schema
    const orgSchemaHtml = schemaGenerator.generateOrganizationSchema(settings);

    // WebSite schema
    const websiteSchemaObj = {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: settings.site_name,
      url: urlManager.baseUrl,
    };

    const parseSchemaHtml = (html) => {
      if (!html) return null;
      const match = html.match(/<script[^>]*>([\s\S]*?)<\/script>/);
      try {
        return match ? JSON.parse(match[1].trim()) : null;
      } catch (e) {
        return null;
      }
    };

    const orgSchemaObj = parseSchemaHtml(orgSchemaHtml);
    const combinedSchemaHtml = schemaGenerator.generateMultiSchema([
      orgSchemaObj,
      websiteSchemaObj,
    ].filter(Boolean));

    seoTags = `${metaTagsHtml}\n  ${combinedSchemaHtml}`;
  } catch (seoError) {
    console.error("Error generating homepage SEO tags:", seoError);
  }

  const content = `
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <h1>Welcome to Our B2B Product Exhibition</h1>
        <p id="hero-subtitle">Your trusted partner for high-quality industrial products and innovative solutions worldwide</p>
        <div style="margin-top: 2rem;">
          <a href="/products" class="btn btn-primary hide-on-mobile" style="margin-right: 1rem;">Browse Products</a>
          <a href="/contact" class="btn btn-secondary">Contact Us</a>
        </div>
      </div>
    </section>

    <style>
      @media (max-width: 768px) {
        .hide-on-mobile {
          display: none !important;
        }
      }
    </style>

    <!-- Featured Products -->
    <section class="container" style="margin-top: 3rem;">
      <h2 style="text-align: center; font-size: 2rem; margin-bottom: 2rem; color: var(--primary-color);">Featured Products</h2>
      <div id="featured-products" class="grid grid-3">
        <div class="spinner"></div>
      </div>
      <!-- Pagination -->
      <div id="featured-pagination-container" style="display: none; margin-top: 2rem;"></div>
      <div style="text-align: center; margin-top: 2rem;">
        <a href="/products" class="btn btn-primary">View All Products</a>
      </div>
    </section>

    <!-- Company Features -->
    <section class="container" style="margin-top: 3rem; margin-bottom: 3rem;">
      <h2 style="text-align: center; font-size: 2rem; margin-bottom: 2rem; color: var(--primary-color);">Why Choose Us</h2>
      <div class="grid grid-3">
        <div class="card">
          <div class="card-content" style="text-align: center;">
            <div style="font-size: 3rem; color: var(--primary-color); margin-bottom: 1rem;">🏆</div>
            <h3 class="card-title">Premium Quality</h3>
            <p class="card-description">
              All products undergo strict quality control and meet international standards.
            </p>
          </div>
        </div>
        <div class="card">
          <div class="card-content" style="text-align: center;">
            <div style="font-size: 3rem; color: var(--primary-color); margin-bottom: 1rem;">🌍</div>
            <h3 class="card-title">Global Reach</h3>
            <p class="card-description">
              Serving customers in over 50 countries with reliable logistics and support.
            </p>
          </div>
        </div>
        <div class="card">
          <div class="card-content" style="text-align: center;">
            <div style="font-size: 3rem; color: var(--primary-color); margin-bottom: 1rem;">💼</div>
            <h3 class="card-title">Expert Service</h3>
            <p class="card-description">
              Professional team ready to provide customized solutions for your needs.
            </p>
          </div>
        </div>
        <div class="card">
          <div class="card-content" style="text-align: center;">
            <div style="font-size: 3rem; color: var(--primary-color); margin-bottom: 1rem;">⚡</div>
            <h3 class="card-title">Fast Delivery</h3>
            <p class="card-description">
              Efficient supply chain management ensures quick turnaround and on-time delivery.
            </p>
          </div>
        </div>
      </div>
    </section>
  `;

  const scripts = `
    <script>
      let allFeaturedProducts = [];
      let featuredCurrentPage = 1;
      const featuredItemsPerPage = 8;

      // Load featured products
      async function loadFeaturedProducts() {
        try {
          const response = await API.get('/products/featured');
          allFeaturedProducts = response.data || [];

          if (allFeaturedProducts.length === 0) {
            document.getElementById('featured-products').innerHTML = '<p style="text-align: center; color: var(--text-light);">No featured products available.</p>';
            return;
          }

          featuredCurrentPage = 1;
          displayFeaturedProducts();
        } catch (error) {
          console.error('Error loading featured products:', error);
          document.getElementById('featured-products').innerHTML =
            '<p style="text-align: center; color: var(--text-light);">Unable to load products. Please try again later.</p>';
        }
      }

      // Display featured products with pagination
      function displayFeaturedProducts() {
        const container = document.getElementById('featured-products');
        const startIndex = (featuredCurrentPage - 1) * featuredItemsPerPage;
        const endIndex = startIndex + featuredItemsPerPage;
        const paginatedProducts = allFeaturedProducts.slice(startIndex, endIndex);

        container.innerHTML = paginatedProducts.map(product => {
          const price = product.price !== null && product.price !== undefined
            ? '$' + parseFloat(product.price).toFixed(2)
            : 'Inquire for Price';
            
          return \`
          <div class="card" style="box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-radius: 4px; border: 1px solid #ddd; background: white; display: flex; flex-direction: column;">
            <div style="position: relative;">
              <img src="\${getImageKitUrl(product.image_url, 'w-400,h-300,cm-pad_resize,bg-FFFFFF') || '/images/placeholder.jpg'}" 
                   alt="\${product.name}" 
                   class="card-image" 
                   onerror="this.src='/images/placeholder.jpg'"
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
        renderFeaturedPagination();
      }

      // Render pagination for featured products
      function renderFeaturedPagination() {
        const totalPages = Math.ceil(allFeaturedProducts.length / featuredItemsPerPage);
        const paginationContainer = document.getElementById('featured-pagination-container');
        
        if (totalPages <= 1) {
          paginationContainer.style.display = 'none';
          return;
        }
        
        paginationContainer.style.display = 'block';
        let html = '<div style="display: flex; justify-content: center; gap: 0.5rem; flex-wrap: wrap;">';
        
        // Previous button
        if (featuredCurrentPage > 1) {
          html += '<button onclick="goToFeaturedPage(' + (featuredCurrentPage - 1) + ')" class="btn btn-primary" style="padding: 0.5rem 1rem;">← Previous</button>';
        }
        
        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
          if (i === featuredCurrentPage) {
            html += '<button style="padding: 0.5rem 1rem; background: var(--primary-color); color: white; border: none; border-radius: 0.375rem; cursor: pointer; font-weight: 600;">' + i + '</button>';
          } else {
            html += '<button onclick="goToFeaturedPage(' + i + ')" style="padding: 0.5rem 1rem; background: #e5e7eb; color: var(--text-dark); border: none; border-radius: 0.375rem; cursor: pointer;">' + i + '</button>';
          }
        }
        
        // Next button
        if (featuredCurrentPage < totalPages) {
          html += '<button onclick="goToFeaturedPage(' + (featuredCurrentPage + 1) + ')" class="btn btn-primary" style="padding: 0.5rem 1rem;">Next →</button>';
        }
        
        html += '</div>';
        paginationContainer.innerHTML = html;
      }

      // Go to specific featured page
      function goToFeaturedPage(page) {
        featuredCurrentPage = page;
        displayFeaturedProducts();
        window.scrollTo({ top: document.getElementById('featured-products').offsetTop - 100, behavior: 'smooth' });
      }

      // Load and apply home page settings
      async function loadHomeSettings() {
        try {
          const response = await API.get('/settings');
          if (response.success) {
            const settings = response.data;

            // Update hero subtitle
            const heroSubtitle = document.getElementById('hero-subtitle');
            if (heroSubtitle && settings.site_description) {
              heroSubtitle.textContent = settings.site_description;
            }

            // Update company introduction
            const companyIntro = document.getElementById('company-intro');
            if (companyIntro && settings.company_intro) {
              companyIntro.textContent = settings.company_intro;
            }
          }
        } catch (error) {
          console.error('Error loading home settings:', error);
        }
      }

      loadFeaturedProducts();
      loadHomeSettings();

      // Add styles for product card description - limit to 3 lines
      const descriptionStyle = document.createElement('style');
      descriptionStyle.textContent = \`
        .card-description {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          line-height: 1.5;
        }
      \`;
      document.head.appendChild(descriptionStyle);
    </script>
  `;

  const html = createLayout(
    settings.site_name,
    content,
    scripts,
    settings.site_description,
    false, // Don't use title suffix for home page
    seoTags,
    settings,
  );

  return new Response(html, {
    headers: {
      "Content-Type": "text/html;charset=UTF-8",
    },
  });
}
