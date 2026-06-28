with open('src/pages/product-detail.js', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Build the new function content
new_fn = (
    '      async function loadProductDetail() {\n'
    '        try {\n'
    "          const response = await API.get('/products/' + productId);\n"
    '\n'
    '          if (!response || !response.success) {\n'
    "            document.getElementById('product-detail').innerHTML = '<p style=\"text-align:center;color:var(--text-light);\">Failed to load product.</p>';\n"
    '            return;\n'
    '          }\n'
    '\n'
    '          const product = response.data;\n'
    '          if (!product) {\n'
    "            document.getElementById('product-detail').innerHTML = '<p style=\"text-align:center;color:var(--text-light);\">Product not found.</p>';\n"
    '            return;\n'
    '          }\n'
    '\n'
    '          // Variant state\n'
    '          const variants = Array.isArray(product.variants) ? product.variants : [];\n'
    '          const colorImages = Array.isArray(product.color_images) ? product.color_images : [];\n'
    '          const hasVariants = variants.length > 0;\n'
    '\n'
    '          // variantMap[color][size] = quantity\n'
    '          const variantMap = {};\n'
    '          variants.forEach(function(v) {\n'
    '            if (!variantMap[v.color_name]) variantMap[v.color_name] = {};\n'
    '            variantMap[v.color_name][v.size_name] = v.quantity;\n'
    '          });\n'
    '\n'
    '          // colorImageMap[color] = { primary, gallery[] }\n'
    '          const colorImageMap = {};\n'
    '          colorImages.forEach(function(ci) {\n'
    "            var gal = []; try { gal = JSON.parse(ci.gallery_images || '[]'); } catch(e) {}\n"
    "            colorImageMap[ci.color_name] = { primary: ci.primary_image_url || '', gallery: gal };\n"
    '          });\n'
    '\n'
    "          const SIZES = ['S','M','L','XL','2XL','3XL','4XL','5XL'];\n"
    '\n'
    '          // Build initial media list\n'
    '          var galleryUrls = [];\n'
    "          try { galleryUrls = JSON.parse(product.gallery_images || '[]'); } catch(e) {}\n"
    '          var baseMedia = [];\n'
    '          if (product.image_url) baseMedia.push(product.image_url);\n'
    '          galleryUrls.forEach(function(u) { if (u && baseMedia.indexOf(u) === -1) baseMedia.push(u); });\n'
    '\n'
    '          function buildThumbsHtml(mediaArr) {\n'
    "            if (mediaArr.length <= 1) return '';\n"
    "            var h = '<div id=\"gallery-thumbs\" style=\"display:flex;flex-direction:column;gap:0.5rem;overflow-y:auto;max-height:500px;padding-right:4px;\">';\n"
    '            mediaArr.forEach(function(u, i) { h += mediaThumb(u, i, i === 0); });\n'
    "            return h + '</div>';\n"
    '          }\n'
    '\n'
    '          function buildMainHtml(mediaArr) {\n'
    "            var mainUrl = mediaArr[0] || '';\n"
    '            return mainUrl\n'
    '              ? mainMediaHtml(mainUrl, product.name)\n'
    '              : \'<div style="background:#f3f4f6;border-radius:0.5rem;height:400px;display:flex;align-items:center;justify-content:center;color:var(--text-light);">No image</div>\';\n'
    '          }\n'
    '\n'
    '          function renderGallery(mediaArr) {\n'
    "            var galContainer = document.getElementById('gallery-container');\n"
    '            if (!galContainer) return;\n'
    "            galContainer.innerHTML = buildThumbsHtml(mediaArr) + '<div id=\"main-media-wrap\" style=\"flex:1;min-width:0;\">' + buildMainHtml(mediaArr) + '</div>';\n"
    '            var snapped = mediaArr.slice();\n'
    '            window.selectMedia = function(idx) {\n'
    '              var url = snapped[idx]; if (!url) return;\n'
    "              document.getElementById('main-media-wrap').innerHTML = mainMediaHtml(url, product.name);\n"
    "              document.querySelectorAll('#gallery-thumbs > div').forEach(function(el, i) {\n"
    "                el.style.border = i === idx ? '2px solid var(--primary-color)' : '2px solid transparent';\n"
    '              });\n'
    '            };\n'
    '          }\n'
    '\n'
    '          // Price block\n'
    "          var priceHtml = '';\n"
    '          if (product.price !== null && product.price !== undefined) {\n'
    "            priceHtml = '<div style=\"background:#eff6ff;border:1px solid #bfdbfe;border-radius:0.5rem;padding:0.75rem 1.25rem;min-width:120px;\">'\n"
    "              + '<div style=\"font-size:0.8rem;color:#2563eb;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.25rem;\">Price</div>'\n"
    "              + '<div style=\"font-size:1.5rem;font-weight:700;color:#1e40af;\">$' + parseFloat(product.price).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2}) + '</div></div>';\n"
    '          }\n'
    "          var priceSectionHtml = priceHtml ? '<div style=\"display:flex;gap:1.5rem;margin-bottom:1.5rem;flex-wrap:wrap;\">' + priceHtml + '</div>' : '';\n"
    '\n'
    '          // Color selector\n'
    "          var colorsHtml = '';\n"
    '          if (hasVariants) {\n'
    '            var colorNames = Object.keys(variantMap);\n'
    '            if (colorNames.length > 0) {\n'
    "              colorsHtml = '<div style=\"margin-bottom:1.25rem;\">'\n"
    "                + '<div style=\"font-size:0.8rem;color:var(--text-light);font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem;\">Color</div>'\n"
    "                + '<div id=\"color-selector\" style=\"display:flex;flex-wrap:wrap;gap:0.5rem;\">';\n"
    '              colorNames.forEach(function(color, idx) {\n'
    '                var hex = getColorHex(color);\n'
    "                var isWhite = hex === '#ffffff' || hex === '#faf9f6';\n"
    "                var swatchBorder = isWhite ? 'border:1px solid #d1d5db;' : '';\n"
    '                var isFirst = idx === 0;\n'
    '                colorsHtml += \'<button type="button" data-color="\' + color + \'" onclick="selectColor(this.getAttribute(\\\'data-color\\\'))"\'\n'
    "                  + ' style=\"display:flex;align-items:center;gap:0.4rem;padding:0.3rem 0.6rem;border-radius:0.375rem;cursor:pointer;font-size:0.85rem;font-weight:500;'\n"
    "                  + (isFirst ? 'border:2px solid var(--primary-color);background:#eff6ff;color:var(--primary-color);' : 'border:1px solid #d1d5db;background:#f9fafb;color:var(--text-dark);')\n"
    "                  + '\">'\n"
    "                  + '<span style=\"width:13px;height:13px;border-radius:50%;background:' + hex + ';' + swatchBorder + 'flex-shrink:0;display:inline-block;\"></span>'\n"
    '                  + color + \'</button>\';\n'
    '              });\n'
    "              colorsHtml += '</div></div>';\n"
    '            }\n'
    '          } else {\n'
    '            var productColors = [];\n'
    "            try { productColors = JSON.parse(product.colors || '[]'); } catch(e) {}\n"
    '            if (productColors.length > 0) {\n'
    "              colorsHtml = '<div style=\"margin-bottom:1.5rem;\">'\n"
    "                + '<div style=\"font-size:0.8rem;color:var(--text-light);font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem;\">Available Colors</div>'\n"
    "                + '<div style=\"display:flex;flex-wrap:wrap;gap:0.5rem;\">';\n"
    '              productColors.forEach(function(color) {\n'
    '                var hex = getColorHex(color);\n'
    "                var isWhite = hex === '#ffffff' || hex === '#faf9f6';\n"
    "                var borderStyle = isWhite ? 'border:1px solid #d1d5db;' : 'border:1px solid transparent;';\n"
    "                colorsHtml += '<div style=\"display:flex;align-items:center;gap:0.35rem;padding:0.25rem 0.5rem;background:#f3f4f6;border-radius:0.25rem;font-size:0.85rem;font-weight:500;\">'\n"
    "                  + '<span style=\"width:12px;height:12px;border-radius:50%;background:' + hex + ';' + borderStyle + '\"></span>'\n"
    "                  + '<span>' + color + '</span></div>';\n"
    '              });\n'
    "              colorsHtml += '</div></div>';\n"
    '            }\n'
    '          }\n'
    '\n'
    '          // Size selector\n'
    "          var sizesHtml = '';\n"
    '          if (hasVariants) {\n'
    "            sizesHtml = '<div style=\"margin-bottom:1.25rem;\">'\n"
    "              + '<div style=\"font-size:0.8rem;color:var(--text-light);font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem;\">Size</div>'\n"
    "              + '<div id=\"size-selector\" style=\"display:flex;flex-wrap:wrap;gap:0.5rem;\">';\n"
    '            SIZES.forEach(function(size) {\n'
    '              sizesHtml += \'<button type="button" data-size="\' + size + \'" onclick="selectSize(this.getAttribute(\\\'data-size\\\'))"\'\n'
    "                + ' style=\"padding:0.3rem 0.7rem;border:1px solid #d1d5db;border-radius:0.375rem;background:#f9fafb;cursor:pointer;font-size:0.85rem;font-weight:600;color:var(--text-dark);\">'\n"
    "                + size + '</button>';\n"
    '            });\n'
    "            sizesHtml += '</div><div id=\"size-qty-display\" style=\"margin-top:0.6rem;min-height:1.5rem;\"></div></div>';\n"
    '          } else {\n'
    '            var productSizes = [];\n'
    "            try { productSizes = JSON.parse(product.sizes || '[]'); } catch(e) {}\n"
    '            if (productSizes.length > 0) {\n'
    "              sizesHtml = '<div style=\"margin-bottom:1.5rem;\">'\n"
    "                + '<div style=\"font-size:0.8rem;color:var(--text-light);font-weight:600;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem;\">Available Sizes</div>'\n"
    "                + '<div style=\"display:flex;flex-wrap:wrap;gap:0.5rem;\">';\n"
    '              productSizes.forEach(function(size) {\n'
    "                sizesHtml += '<div style=\"padding:0.25rem 0.75rem;background:#f3f4f6;border:1px solid #e5e7eb;border-radius:0.25rem;font-size:0.85rem;font-weight:600;min-width:32px;text-align:center;\">' + size + '</div>';\n"
    '              });\n'
    "              sizesHtml += '</div></div>';\n"
    '            }\n'
    '          }\n'
    '\n'
    '          // Render page\n'
    "          document.getElementById('product-detail').innerHTML =\n"
    "            '<div style=\"margin-bottom:2rem;\">'\n"
    "              + '<a href=\"/\" style=\"color:var(--text-light);text-decoration:none;\">Home</a>'\n"
    "              + '<span style=\"color:var(--text-light);\"> / </span>'\n"
    "              + '<a href=\"/products\" style=\"color:var(--text-light);text-decoration:none;\">Products</a>'\n"
    "              + '<span style=\"color:var(--text-light);\"> / </span>'\n"
    "              + '<span style=\"color:var(--primary-color);\">' + product.name + '</span>'\n"
    "            + '</div>'\n"
    "            + '<div style=\"display:grid;grid-template-columns:1fr 1fr;gap:3rem;margin-bottom:3rem;\" id=\"product-grid\">'\n"
    "              + '<div id=\"gallery-container\" style=\"display:flex;gap:0.75rem;\">'\n"
    '                + buildThumbsHtml(baseMedia)\n'
    "                + '<div id=\"main-media-wrap\" style=\"flex:1;min-width:0;\">' + buildMainHtml(baseMedia) + '</div>'\n"
    "              + '</div>'\n"
    "              + '<div>'\n"
    "                + '<div style=\"margin-bottom:1rem;\"><span style=\"background:var(--primary-color);color:white;padding:0.25rem 0.75rem;border-radius:1rem;font-size:0.85rem;\">' + (product.category_name || 'General') + '</span></div>'\n"
    "                + '<h1 style=\"font-size:2rem;margin-bottom:1rem;color:var(--text-dark);\">' + product.name + '</h1>'\n"
    "                + '<p style=\"color:var(--text-light);font-size:1.1rem;line-height:1.8;margin-bottom:1.5rem;\">' + (product.description || 'No description available') + '</p>'\n"
    '                + priceSectionHtml\n'
    '                + colorsHtml\n'
    '                + sizesHtml\n'
    "                + '<button id=\"send-inquiry-btn\" class=\"btn btn-primary\" style=\"font-size:1.1rem;padding:1rem 2rem;\">Send Inquiry</button>'\n"
    "              + '</div>'\n"
    "            + '</div>'\n"
    "            + '<div style=\"background:var(--bg-light);padding:2rem;border-radius:0.5rem;margin-bottom:2rem;\">'\n"
    "              + '<h2 style=\"font-size:1.5rem;margin-bottom:1rem;color:var(--primary-color);\">Product Description</h2>'\n"
    '              + (function() {\n'
    "                  var mdText = product.detailed_description || '';\n"
    "                  if (typeof marked !== 'undefined' && typeof DOMPurify !== 'undefined') {\n"
    '                    try {\n'
    '                      var safeHtml = renderMarkdown(mdText);\n'
    "                      if (safeHtml) return '<div class=\"md-body\">' + safeHtml + '</div>';\n"
    "                      return '<p>No detailed description available</p>';\n"
    '                    } catch (_e) {\n'
    "                      return '<p style=\"color:var(--text-dark);line-height:1.8;white-space:pre-line;\">' + mdText + '</p>';\n"
    '                    }\n'
    '                  }\n'
    "                  return '<p style=\"color:var(--text-dark);line-height:1.8;white-space:pre-line;\">' + (mdText || product.description || 'No detailed description available') + '</p>';\n"
    '                })()\n'
    "            + '</div>';\n"
    '\n'
    '          // Interaction state\n'
    '          var currentColor = hasVariants ? Object.keys(variantMap)[0] : null;\n'
    '          var currentSize = null;\n'
    '\n'
    '          window.selectColor = function(color) {\n'
    '            currentColor = color; currentSize = null;\n'
    "            document.querySelectorAll('#color-selector button').forEach(function(btn) {\n"
    "              var active = btn.getAttribute('data-color') === color;\n"
    "              btn.style.border = active ? '2px solid var(--primary-color)' : '1px solid #d1d5db';\n"
    "              btn.style.background = active ? '#eff6ff' : '#f9fafb';\n"
    "              btn.style.color = active ? 'var(--primary-color)' : 'var(--text-dark)';\n"
    '            });\n'
    "            document.querySelectorAll('#size-selector button').forEach(function(btn) {\n"
    "              btn.style.border = '1px solid #d1d5db'; btn.style.background = '#f9fafb'; btn.style.color = 'var(--text-dark)';\n"
    '            });\n'
    "            var qd = document.getElementById('size-qty-display'); if (qd) qd.innerHTML = '';\n"
    '            var ci = colorImageMap[color];\n'
    '            var mediaArr = [];\n'
    '            if (ci && ci.primary) mediaArr.push(ci.primary);\n'
    '            if (ci && ci.gallery) ci.gallery.forEach(function(u) { if (u && mediaArr.indexOf(u)===-1) mediaArr.push(u); });\n'
    '            if (!mediaArr.length) mediaArr = baseMedia.slice();\n'
    '            renderGallery(mediaArr);\n'
    '          };\n'
    '\n'
    '          window.selectSize = function(size) {\n'
    '            currentSize = size;\n'
    "            document.querySelectorAll('#size-selector button').forEach(function(btn) {\n"
    "              var active = btn.getAttribute('data-size') === size;\n"
    "              btn.style.border = active ? '2px solid var(--primary-color)' : '1px solid #d1d5db';\n"
    "              btn.style.background = active ? '#eff6ff' : '#f9fafb';\n"
    "              btn.style.color = active ? 'var(--primary-color)' : 'var(--text-dark)';\n"
    '            });\n'
    "            var el = document.getElementById('size-qty-display');\n"
    '            if (!el || !currentColor) return;\n'
    '            var qty = (variantMap[currentColor] && variantMap[currentColor][size] !== undefined) ? variantMap[currentColor][size] : null;\n'
    '            if (qty === null) {\n'
    "              el.innerHTML = '<span style=\"color:var(--text-light);font-size:0.85rem;\">No stock data</span>';\n"
    '            } else if (qty === 0) {\n'
    "              el.innerHTML = '<span style=\"display:inline-flex;align-items:center;gap:0.35rem;background:#fef2f2;border:1px solid #fecaca;border-radius:0.375rem;padding:0.3rem 0.7rem;font-size:0.85rem;color:#dc2626;font-weight:600;\">Out of stock</span>';\n"
    '            } else {\n'
    "              el.innerHTML = '<span style=\"display:inline-flex;align-items:center;gap:0.35rem;background:#f0fdf4;border:1px solid #bbf7d0;border-radius:0.375rem;padding:0.3rem 0.7rem;font-size:0.85rem;color:#16a34a;font-weight:600;\">'\n"
    '                + \'<svg width=\"14\" height=\"14\" viewBox=\"0 0 20 20\" fill=\"currentColor\"><path fill-rule=\"evenodd\" d=\"M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z\" clip-rule=\"evenodd\"/></svg>\'\n'
    "                + qty.toLocaleString() + ' pcs available</span>';\n"
    '            }\n'
    '          };\n'
    '\n'
    '          window.selectMedia = function(idx) {\n'
    '            var url = baseMedia[idx]; if (!url) return;\n'
    "            document.getElementById('main-media-wrap').innerHTML = mainMediaHtml(url, product.name);\n"
    "            document.querySelectorAll('#gallery-thumbs > div').forEach(function(el, i) {\n"
    "              el.style.border = i === idx ? '2px solid var(--primary-color)' : '2px solid transparent';\n"
    '            });\n'
    '          };\n'
    '\n'
    '          // Auto-select first color\n'
    '          if (hasVariants && currentColor) selectColor(currentColor);\n'
    '\n'
    "          document.getElementById('send-inquiry-btn').addEventListener('click', function() {\n"
    '            var maxAttempts = 60, attemptCount = 0;\n'
    '            var pollForFunction = function() {\n'
    '              attemptCount++;\n'
    "              if (typeof window.toggleContactFormPanel === 'function') {\n"
    "                var messageField = document.getElementById('cfp-message');\n"
    '                if (messageField) {\n'
    "                  var context = 'I am interested in: ' + product.name;\n"
    "                  if (currentColor) context += '\\nColor: ' + currentColor;\n"
    "                  if (currentSize) context += '\\nSize: ' + currentSize;\n"
    "                  context += '\\nProduct URL: ' + window.location.href + '\\n\\n';\n"
    '                  messageField.value = context;\n'
    '                }\n'
    '                window.toggleContactFormPanel();\n'
    '              } else if (attemptCount < maxAttempts) {\n'
    '                setTimeout(pollForFunction, 50);\n'
    '              } else {\n'
    "                if (typeof window.showNotification === 'function') {\n"
    "                  window.showNotification('Contact form is temporarily unavailable.', 'error');\n"
    "                } else { alert('Contact form is temporarily unavailable.'); }\n"
    '              }\n'
    '            };\n'
    '            pollForFunction();\n'
    '          });\n'
    '\n'
    '        } catch (error) {\n'
    "          console.error('Error loading product:', error);\n"
    "          document.getElementById('product-detail').innerHTML = '<p style=\"text-align:center;color:var(--text-light);\">Unable to load product details. Please try again later.</p>';\n"
    '        }\n'
    '      }\n'
)

# Lines 219-402 (1-indexed) = indices 218-401 (0-indexed)
before = lines[:218]   # lines 1..218
after  = lines[402:]   # lines 403..end

new_lines = before + [new_fn] + after
with open('src/pages/product-detail.js', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print('Done. Total lines:', len(new_lines))
