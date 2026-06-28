/**
 * Product Detail Page
 * Displays detailed information about a specific product
 */

import { createLayout } from "./layout";

export async function productDetailPage(request, env) {
  const url = new URL(request.url);
  const pathParts = url.pathname.split("/").filter(Boolean);
  const key = pathParts[1] || "";

  const isNumericId = /^\d+$/.test(key);
  let product = null;

  const { URLManager } = await import("../seo/url-manager");
  const urlManager = new URLManager(env);

  if (isNumericId) {
    const productId = parseInt(key);
    try {
      product = await env.DB.prepare("SELECT * FROM products WHERE id = ?")
        .bind(productId)
        .first();
    } catch (error) {
      console.error("Error loading product by ID for SEO:", error);
    }

    if (product) {
      let slug = null;
      try {
        const slugRow = await env.DB.prepare("SELECT slug FROM product_slugs WHERE product_id = ?")
          .bind(productId)
          .first();
        if (slugRow && slugRow.slug) {
          slug = slugRow.slug;
        } else {
          const baseSlug = urlManager.generateSlug(product.name);
          slug = await urlManager.ensureUniqueSlug(baseSlug);
          await urlManager.saveProductSlug(productId, slug);
        }
      } catch (error) {
        console.error("Error managing slug for ID request:", error);
      }

      if (slug) {
        return new Response("", {
          status: 301,
          headers: {
            "Location": `/products/${slug}`,
          },
        });
      }
    }
  } else {
    try {
      product = await urlManager.getProductBySlug(key);
    } catch (error) {
      console.error("Error loading product by slug for SEO:", error);
    }
  }

  // Load product info from database for SEO
  let pageTitle = "Product Details";
  let metaDescription = "View detailed product information";
  let seoTags = "";

  if (product) {
    pageTitle = product.name;
    metaDescription =
      product.description ||
      product.detailed_description ||
      `${product.name} - High-quality product`;

    try {
      const { MetaTagManager } = await import("../seo/meta-manager");
      const { SchemaGenerator } = await import("../seo/schema-generator");

      const metaManager = new MetaTagManager(env);
      const schemaGenerator = new SchemaGenerator(env);

      // Generate meta tags
      const canonicalUrl = urlManager.generateCanonicalUrl(`/products/${key}`);
      const metaTagsHtml = metaManager.generateMetaTags({
        title: product.name,
        description: metaDescription,
        canonicalUrl,
        imageUrl: product.image_url,
        pageType: "product",
        product,
      });

      // Generate schemas
      const productUrl = urlManager.generateCanonicalUrl(`/products/${key}`);
      const productSchemaHtml = schemaGenerator.generateProductSchema(product, productUrl);

      const breadcrumbs = [
        { name: "Home", url: "/" },
        { name: "Products", url: "/products" },
        { name: product.name, url: `/products/${key}` },
      ];
      const breadcrumbSchemaHtml = schemaGenerator.generateBreadcrumbSchema(breadcrumbs);

      // Parse and combine schemas into a single graph script
      const parseSchemaHtml = (html) => {
        if (!html) return null;
        const match = html.match(/<script[^>]*>([\s\S]*?)<\/script>/);
        try {
          return match ? JSON.parse(match[1].trim()) : null;
        } catch (e) {
          return null;
        }
      };

      const productSchemaObj = parseSchemaHtml(productSchemaHtml);
      const breadcrumbSchemaObj = parseSchemaHtml(breadcrumbSchemaHtml);

      const combinedSchemaHtml = schemaGenerator.generateMultiSchema([
        productSchemaObj,
        breadcrumbSchemaObj,
      ]);

      seoTags = `${metaTagsHtml}\n  ${combinedSchemaHtml}`;
    } catch (seoError) {
      console.error("Error generating SEO tags:", seoError);
    }
  }

  const content = `
    <div id="product-detail" class="container" style="margin-top: 2rem; margin-bottom: 3rem;">
      <div class="spinner"></div>
    </div>
  `;

  const scripts = `
    <script
      src="https://cdnjs.cloudflare.com/ajax/libs/marked/16.3.0/lib/marked.umd.min.js"
      integrity="sha512-V6rGY7jjOEUc7q5Ews8mMlretz1Vn2wLdMW/qgABLWunzsLfluM0FwHuGjGQ1lc8jO5vGpGIGFE+rTzB+63HdA=="
      crossorigin="anonymous"
    ></script>
    <script
      src="https://cdnjs.cloudflare.com/ajax/libs/dompurify/3.2.7/purify.min.js"
      integrity="sha512-78KH17QLT5e55GJqP76vutp1D2iAoy06WcYBXB6iBCsmO6wWzx0Qdg8EDpm8mKXv68BcvHOyeeP4wxAL0twJGQ=="
      crossorigin="anonymous"
    ></script>
    <script>
      const productId = "${product ? product.id : key}";

      function getColorHex(color) {
        const map = {
          "black": "#000000",
          "royal blue": "#4169e1",
          "white": "#ffffff",
          "navy blue": "#000080",
          "medium gray": "#808080",
          "caramel": "#af6e2d",
          "emerald green": "#50c878",
          "mud gray": "#796d62",
          "dark gray": "#333333",
          "dark green": "#013220",
          "coffee": "#6f4e37",
          "rose red": "#c21e56",
          "off-white": "#faf9f6",
          "denim blue": "#3b5f8f",
          "light brown": "#b5651d",
          "bottle green": "#006a4e",
          "coffee brown": "#4a3b32",
          "light khaki": "#f0e68c",
          "jay blue": "#2874a6",
          "heather gray": "#b2beb5",
          "deep green": "#05472a",
          "gray": "#9ca3af",
          "green": "#10b981",
          "apricot": "#fbceb1",
          "bright green": "#4ade80",
          "navy": "#00003b",
          "yellow khaki": "#c3b091",
          "burgundy": "#800020",
          "medium blue": "#3b82f6"
        };
        return map[color.toLowerCase().trim()] || "#cccccc";
      }

      function renderMarkdown(text) {
        if (!text || text.trim() === '') return null;
        try {
          var rawHtml = marked.parse(text);
          return DOMPurify.sanitize(rawHtml);
        } catch (_err) {
          return null;
        }
      }

      function isVideo(url) {
        return /\\.(mp4|webm|ogg)/i.test(url.split('?')[0]);
      }

      function mediaThumb(url, idx, isActive) {
        var border = isActive ? 'border:2px solid var(--primary-color);' : 'border:2px solid transparent;';
        var base = 'cursor:pointer;' + border + 'border-radius:0.375rem;overflow:hidden;width:72px;height:72px;flex-shrink:0;';
        if (isVideo(url)) {
          return '<div onclick="selectMedia(' + idx + ')" data-idx="' + idx + '" style="' + base + 'background:#000;display:flex;align-items:center;justify-content:center;position:relative;">'
            + '<video src="' + url + '" style="width:100%;height:100%;object-fit:cover;" muted></video>'
            + '<span style="position:absolute;color:white;font-size:1.4rem;text-shadow:0 1px 4px rgba(0,0,0,0.8);">&#9654;</span>'
            + '</div>';
        }
        return '<div onclick="selectMedia(' + idx + ')" data-idx="' + idx + '" style="' + base + '">'
          + '<img src="' + getImageKitUrl(url, 'w-144,h-144,cm-pad_resize,bg-F3F3F6') + '" style="width:100%;height:100%;object-fit:cover;">'
          + '</div>';
      }

      function mainMediaHtml(url, altText) {
        if (isVideo(url)) {
          return '<video id="main-media-video" src="' + url + '" controls style="width:100%;max-height:500px;border-radius:0.5rem;background:#000;"></video>';
        }
        return '<img id="main-media-img" src="' + getImageKitUrl(url, 'w-700,h-500,cm-pad_resize,bg-F3F3F6') + '" alt="' + (altText || '') + '" style="width:100%;max-height:500px;object-fit:contain;background:#f3f4f6;border-radius:0.5rem;box-shadow:0 4px 6px rgba(0,0,0,0.1);">';
      }

      async function loadProductDetail() {
        try {
          const response = await API.get('/products/' + productId);

          if (!response || !response.success) {
            document.getElementById('product-detail').innerHTML = '<p style="text-align:center;color:var(--text-light);">Failed to load product.</p>';
            return;
          }

          const product = response.data;
          if (!product) {
            document.getElementById('product-detail').innerHTML = '<p style="text-align:center;color:var(--text-light);">Product not found.</p>';
            return;
          }

          // Variant state
          const variants = Array.isArray(product.variants) ? product.variants : [];
          const colorImages = Array.isArray(product.color_images) ? product.color_images : [];
          const hasVariants = variants.length > 0;

          // variantMap[color][size] = quantity
          const variantMap = {};
          variants.forEach(function(v) {
            if (!variantMap[v.color_name]) variantMap[v.color_name] = {};
            variantMap[v.color_name][v.size_name] = v.quantity;
          });

          // colorImageMap[color] = { primary, gallery[] }
          const colorImageMap = {};
          colorImages.forEach(function(ci) {
            var gal = []; try { gal = JSON.parse(ci.gallery_images || '[]'); } catch(e) {}
            colorImageMap[ci.color_name] = { primary: ci.primary_image_url || '', gallery: gal };
          });

          const SIZES = ['S','M','L','XL','2XL','3XL','4XL','5XL'];

          // Build initial media list
          var galleryUrls = [];
          try { galleryUrls = JSON.parse(product.gallery_images || '[]'); } catch(e) {}
          var baseMedia = [];
          if (product.image_url) baseMedia.push(product.image_url);
          galleryUrls.forEach(function(u) { if (u && baseMedia.indexOf(u) === -1) baseMedia.push(u); });

          function buildThumbsHtml(mediaArr) {
            if (mediaArr.length <= 1) return '';
            var h = '<div id="gallery-thumbs" style="display:flex;flex-direction:column;gap:0.5rem;overflow-y:auto;max-height:500px;padding-right:4px;">';
            mediaArr.forEach(function(u, i) { h += mediaThumb(u, i, i === 0); });
            return h + '</div>';
          }

          function buildMainHtml(mediaArr) {
            var mainUrl = mediaArr[0] || '';
            return mainUrl
              ? mainMediaHtml(mainUrl, product.name)
              : '<div style="background:#f3f4f6;border-radius:0.5rem;height:400px;display:flex;align-items:center;justify-content:center;color:var(--text-light);">No image</div>';
          }

          function renderGallery(mediaArr) {
            var galContainer = document.getElementById('gallery-container');
            if (!galContainer) return;
            galContainer.innerHTML = buildThumbsHtml(mediaArr) + '<div id="main-media-wrap" style="flex:1;min-width:0;">' + buildMainHtml(mediaArr) + '</div>';
            var snapped = mediaArr.slice();
            window.selectMedia = function(idx) {
              var url = snapped[idx]; if (!url) return;
              document.getElementById('main-media-wrap').innerHTML = mainMediaHtml(url, product.name);
              document.querySelectorAll('#gallery-thumbs > div').forEach(function(el, i) {
                el.style.border = i === idx ? '2px solid var(--primary-color)' : '2px solid transparent';
              });
            };
          }

          // Price block
          var priceHtml = '';
          if (product.price !== null && product.price !== undefined) {
            priceHtml = '<div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:0.5rem;padding:0.75rem 1.25rem;min-width:120px;">'
              + '<div style="font-size:0.8rem;color:#2563eb;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem;">Price</div>'
              + '<div style="font-size:1.5rem;font-weight:700;color:#1e40af;">$' + parseFloat(product.price).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}) + '</div></div>';
          }
          var priceSectionHtml = priceHtml ? '<div style="display:flex;gap:1.5rem;margin-bottom:1.5rem;flex-wrap:wrap;">' + priceHtml + '</div>' : '';

          // Color selector
          var colorsHtml = '';
          if (hasVariants) {
            var colorNames = Object.keys(variantMap);
            if (colorNames.length > 0) {
              colorsHtml = '<div style="margin-bottom:1.25rem;">'
                + '<div style="font-size:0.8rem;color:var(--text-light);font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem;">Color</div>'
                + '<div id="color-selector" style="display:flex;flex-wrap:wrap;gap:0.5rem;">';
              colorNames.forEach(function(color, idx) {
                var hex = getColorHex(color);
                var isWhite = hex === '#ffffff' || hex === '#faf9f6';
                var swatchBorder = isWhite ? 'border:1px solid #d1d5db;' : '';
                var isFirst = idx === 0;
                colorsHtml += '<button type="button" data-color="' + color + '" onclick="selectColor(this.getAttribute(\\\'data-color\\\'))"'
                  + ' style="display:flex;align-items:center;gap:0.4rem;padding:0.3rem 0.6rem;border-radius:0.375rem;cursor:pointer;font-size:0.85rem;font-weight:500;'
                  + (isFirst ? 'border:2px solid var(--primary-color);background:#eff6ff;color:var(--primary-color);' : 'border:1px solid #d1d5db;background:#f9fafb;color:var(--text-dark);')
                  + '">'
                  + '<span style="width:13px;height:13px;border-radius:50%;background:' + hex + ';' + swatchBorder + 'flex-shrink:0;display:inline-block;"></span>'
                  + color + '</button>';
              });
              colorsHtml += '</div></div>';
            }
          } else {
            var productColors = [];
            try { productColors = JSON.parse(product.colors || '[]'); } catch(e) {}
            if (productColors.length > 0) {
              colorsHtml = '<div style="margin-bottom:1.5rem;">'
                + '<div style="font-size:0.8rem;color:var(--text-light);font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem;">Available Colors</div>'
                + '<div style="display:flex;flex-wrap:wrap;gap:0.5rem;">';
              productColors.forEach(function(color) {
                var hex = getColorHex(color);
                var isWhite = hex === '#ffffff' || hex === '#faf9f6';
                var borderStyle = isWhite ? 'border:1px solid #d1d5db;' : 'border:1px solid transparent;';
                colorsHtml += '<div style="display:flex;align-items:center;gap:0.35rem;padding:0.25rem 0.5rem;background:#f3f4f6;border-radius:0.25rem;font-size:0.85rem;font-weight:500;">'
                  + '<span style="width:12px;height:12px;border-radius:50%;background:' + hex + ';' + borderStyle + '"></span>'
                  + '<span>' + color + '</span></div>';
              });
              colorsHtml += '</div></div>';
            }
          }

          // Size selector
          var sizesHtml = '';
          if (hasVariants) {
            sizesHtml = '<div style="margin-bottom:1.25rem;">'
              + '<div style="font-size:0.8rem;color:var(--text-light);font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem;">Size</div>'
              + '<div id="size-selector" style="display:flex;flex-wrap:wrap;gap:0.5rem;">';
            SIZES.forEach(function(size) {
              sizesHtml += '<button type="button" data-size="' + size + '" onclick="selectSize(this.getAttribute(\\\'data-size\\\'))"'
                + ' style="padding:0.3rem 0.7rem;border:1px solid #d1d5db;border-radius:0.375rem;background:#f9fafb;cursor:pointer;font-size:0.85rem;font-weight:600;color:var(--text-dark);">'
                + size + '</button>';
            });
            sizesHtml += '</div><div id="size-qty-display" style="margin-top:0.6rem;min-height:1.5rem;"></div></div>';
          } else {
            var productSizes = [];
            try { productSizes = JSON.parse(product.sizes || '[]'); } catch(e) {}
            if (productSizes.length > 0) {
              sizesHtml = '<div style="margin-bottom:1.5rem;">'
                + '<div style="font-size:0.8rem;color:var(--text-light);font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem;">Available Sizes</div>'
                + '<div style="display:flex;flex-wrap:wrap;gap:0.5rem;">';
              productSizes.forEach(function(size) {
                sizesHtml += '<div style="padding:0.25rem 0.75rem;background:#f3f4f6;border:1px solid #e5e7eb;border-radius:0.25rem;font-size:0.85rem;font-weight:600;min-width:32px;text-align:center;">' + size + '</div>';
              });
              sizesHtml += '</div></div>';
            }
          }

          // Render page
          document.getElementById('product-detail').innerHTML =
            '<div style="margin-bottom:2rem;">'
              + '<a href="/" style="color:var(--text-light);text-decoration:none;">Home</a>'
              + '<span style="color:var(--text-light);"> / </span>'
              + '<a href="/products" style="color:var(--text-light);text-decoration:none;">Products</a>'
              + '<span style="color:var(--text-light);"> / </span>'
              + '<span style="color:var(--primary-color);">' + product.name + '</span>'
            + '</div>'
            + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:3rem;margin-bottom:3rem;" id="product-grid">'
              + '<div id="gallery-container" style="display:flex;gap:0.75rem;">'
                + buildThumbsHtml(baseMedia)
                + '<div id="main-media-wrap" style="flex:1;min-width:0;">' + buildMainHtml(baseMedia) + '</div>'
              + '</div>'
              + '<div>'
                + '<div style="margin-bottom:1rem;"><span style="background:var(--primary-color);color:white;padding:0.25rem 0.75rem;border-radius:1rem;font-size:0.85rem;">' + (product.category_name || 'General') + '</span></div>'
                + '<h1 style="font-size:2rem;margin-bottom:1rem;color:var(--text-dark);">' + product.name + '</h1>'
                + '<p style="color:var(--text-light);font-size:1.1rem;line-height:1.8;margin-bottom:1.5rem;">' + (product.description || 'No description available') + '</p>'
                + priceSectionHtml
                + colorsHtml
                + sizesHtml
                + '<button id="send-inquiry-btn" class="btn btn-primary" style="font-size:1.1rem;padding:1rem 2rem;">Send Inquiry</button>'
              + '</div>'
            + '</div>'
            + '<div style="background:var(--bg-light);padding:2rem;border-radius:0.5rem;margin-bottom:2rem;">'
              + '<h2 style="font-size:1.5rem;margin-bottom:1rem;color:var(--primary-color);">Product Description</h2>'
              + (function() {
                  var mdText = product.detailed_description || '';
                  if (typeof marked !== 'undefined' && typeof DOMPurify !== 'undefined') {
                    try {
                      var safeHtml = renderMarkdown(mdText);
                      if (safeHtml) return '<div class="md-body">' + safeHtml + '</div>';
                      return '<p>No detailed description available</p>';
                    } catch (_e) {
                      return '<p style="color:var(--text-dark);line-height:1.8;white-space:pre-line;">' + mdText + '</p>';
                    }
                  }
                  return '<p style="color:var(--text-dark);line-height:1.8;white-space:pre-line;">' + (mdText || product.description || 'No detailed description available') + '</p>';
                })()
            + '</div>';

          // Interaction state
          var currentColor = hasVariants ? Object.keys(variantMap)[0] : null;
          var currentSize = null;

          window.selectColor = function(color) {
            currentColor = color; currentSize = null;
            document.querySelectorAll('#color-selector button').forEach(function(btn) {
              var active = btn.getAttribute('data-color') === color;
              btn.style.border = active ? '2px solid var(--primary-color)' : '1px solid #d1d5db';
              btn.style.background = active ? '#eff6ff' : '#f9fafb';
              btn.style.color = active ? 'var(--primary-color)' : 'var(--text-dark)';
            });
            document.querySelectorAll('#size-selector button').forEach(function(btn) {
              btn.style.border = '1px solid #d1d5db'; btn.style.background = '#f9fafb'; btn.style.color = 'var(--text-dark)';
            });
            var qd = document.getElementById('size-qty-display'); if (qd) qd.innerHTML = '';
            var ci = colorImageMap[color];
            var mediaArr = [];
            if (ci && ci.primary) mediaArr.push(ci.primary);
            if (ci && ci.gallery) ci.gallery.forEach(function(u) { if (u && mediaArr.indexOf(u)===-1) mediaArr.push(u); });
            if (!mediaArr.length) mediaArr = baseMedia.slice();
            renderGallery(mediaArr);
          };

          window.selectSize = function(size) {
            currentSize = size;
            document.querySelectorAll('#size-selector button').forEach(function(btn) {
              var active = btn.getAttribute('data-size') === size;
              btn.style.border = active ? '2px solid var(--primary-color)' : '1px solid #d1d5db';
              btn.style.background = active ? '#eff6ff' : '#f9fafb';
              btn.style.color = active ? 'var(--primary-color)' : 'var(--text-dark)';
            });
            var el = document.getElementById('size-qty-display');
            if (!el || !currentColor) return;
            var qty = (variantMap[currentColor] && variantMap[currentColor][size] !== undefined) ? variantMap[currentColor][size] : null;
            if (qty === null) {
              el.innerHTML = '<span style="color:var(--text-light);font-size:0.85rem;">No stock data</span>';
            } else if (qty === 0) {
              el.innerHTML = '<span style="display:inline-flex;align-items:center;gap:0.35rem;background:#fef2f2;border:1px solid #fecaca;border-radius:0.375rem;padding:0.3rem 0.7rem;font-size:0.85rem;color:#dc2626;font-weight:600;">Out of stock</span>';
            } else {
              el.innerHTML = '<span style="display:inline-flex;align-items:center;gap:0.35rem;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:0.375rem;padding:0.3rem 0.7rem;font-size:0.85rem;color:#16a34a;font-weight:600;">'
                + '<svg width="14" height="14" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>'
                + qty.toLocaleString() + ' pcs available</span>';
            }
          };

          window.selectMedia = function(idx) {
            var url = baseMedia[idx]; if (!url) return;
            document.getElementById('main-media-wrap').innerHTML = mainMediaHtml(url, product.name);
            document.querySelectorAll('#gallery-thumbs > div').forEach(function(el, i) {
              el.style.border = i === idx ? '2px solid var(--primary-color)' : '2px solid transparent';
            });
          };

          // Auto-select first color
          if (hasVariants && currentColor) selectColor(currentColor);

          document.getElementById('send-inquiry-btn').addEventListener('click', function() {
            var maxAttempts = 60, attemptCount = 0;
            var pollForFunction = function() {
              attemptCount++;
              if (typeof window.toggleContactFormPanel === 'function') {
                var messageField = document.getElementById('cfp-message');
                if (messageField) {
                  var context = 'I am interested in: ' + product.name;
                  if (currentColor) context += '\\nColor: ' + currentColor;
                  if (currentSize) context += '\\nSize: ' + currentSize;
                  context += '\\nProduct URL: ' + window.location.href + '\\n\\n';
                  messageField.value = context;
                }
                window.toggleContactFormPanel();
              } else if (attemptCount < maxAttempts) {
                setTimeout(pollForFunction, 50);
              } else {
                if (typeof window.showNotification === 'function') {
                  window.showNotification('Contact form is temporarily unavailable.', 'error');
                } else { alert('Contact form is temporarily unavailable.'); }
              }
            };
            pollForFunction();
          });

        } catch (error) {
          console.error('Error loading product:', error);
          document.getElementById('product-detail').innerHTML = '<p style="text-align:center;color:var(--text-light);">Unable to load product details. Please try again later.</p>';
        }
      }

      loadProductDetail();

      var responsiveStyle = document.createElement('style');
      responsiveStyle.textContent = '@media (max-width: 768px) { #product-grid { grid-template-columns: 1fr !important; } #gallery-container { flex-direction: column !important; } #gallery-thumbs { flex-direction: row !important; max-height: none !important; overflow-x: auto; overflow-y: hidden; padding-right: 0; padding-bottom: 4px; order: 2; } #main-media-wrap { order: 1; } }';
      document.head.appendChild(responsiveStyle);

      var mdBodyStyle = document.createElement('style');
      mdBodyStyle.textContent = [
        '.md-body { color: var(--text-dark, #1f2937); line-height: 1.75; font-size: 1rem; }',
        '.md-body h1 { font-size: 2rem; font-weight: 700; margin: 1.5rem 0 0.75rem; color: var(--text-dark, #111827); }',
        '.md-body h2 { font-size: 1.6rem; font-weight: 700; margin: 1.4rem 0 0.7rem; color: var(--text-dark, #111827); }',
        '.md-body h3 { font-size: 1.35rem; font-weight: 600; margin: 1.25rem 0 0.6rem; color: var(--text-dark, #111827); }',
        '.md-body h4 { font-size: 1.15rem; font-weight: 600; margin: 1.1rem 0 0.5rem; color: var(--text-dark, #111827); }',
        '.md-body h5 { font-size: 1rem; font-weight: 600; margin: 1rem 0 0.5rem; color: var(--text-dark, #111827); }',
        '.md-body h6 { font-size: 0.9rem; font-weight: 600; margin: 0.9rem 0 0.45rem; color: var(--text-light, #6b7280); }',
        '.md-body ul { padding-left: 1.75rem; margin: 0.75rem 0; list-style: disc; }',
        '.md-body ol { padding-left: 1.75rem; margin: 0.75rem 0; list-style: decimal; }',
        '.md-body table { border-collapse: collapse; width: 100%; margin: 1rem 0; }',
        '.md-body th { border: 1px solid #d1d5db; padding: 0.5rem 0.75rem; background: #f9fafb; font-weight: 600; text-align: left; }',
        '.md-body td { border: 1px solid #d1d5db; padding: 0.5rem 0.75rem; }',
        '.md-body tr:nth-child(even) { background-color: #f3f4f6; }',
        '.md-body code { background: #f1f5f9; color: #0f172a; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 0.875em; padding: 0.15em 0.35em; border-radius: 0.25rem; }',
        '.md-body pre { background: #1e293b; color: #e2e8f0; padding: 1rem 1.25rem; border-radius: 0.5rem; overflow-x: auto; margin: 1rem 0; }',
        '.md-body pre code { background: transparent; color: inherit; padding: 0; font-size: 0.875rem; border-radius: 0; }',
        '.md-body blockquote { border-left: 4px solid var(--primary-color, #2563eb); padding-left: 1rem; margin: 1rem 0; color: var(--text-light, #6b7280); font-style: italic; }',
        '.md-body hr { border: none; border-top: 1px solid #e5e7eb; margin: 1.5rem 0; }'
      ].join(' ');
      document.head.appendChild(mdBodyStyle);
    </script>
  `;

  // Load settings from KV for footer quotes
  let settings = null;
  try {
    const settingsJson = await env.STATIC_ASSETS.get("website_settings");
    if (settingsJson) {
      settings = JSON.parse(settingsJson);
    }
  } catch (error) {
    console.error("Error loading settings for footer:", error);
  }

  const html = createLayout(
    pageTitle,
    content,
    scripts,
    metaDescription,
    false,
    seoTags,
    settings,
  );

  return new Response(html, {
    headers: {
      "Content-Type": "text/html;charset=UTF-8",
    },
  });
}
