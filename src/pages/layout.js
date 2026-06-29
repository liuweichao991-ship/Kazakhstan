/**
 * HTML Layout Template
 * Provides common layout structure for all pages
 */

export function createLayout(
  title,
  content,
  additionalScripts = "",
  metaDescription = "B2B Product Exhibition - High-quality industrial products and solutions",
  useTitleSuffix = true,
  seoTags = "",
  settings = null,
) {
  const pageTitle = useTitleSuffix
    ? `${title} - B2B Product Exhibition`
    : title;
  
  const hasSeoTitle = seoTags && seoTags.includes("<title>");
  const hasSeoDesc = seoTags && (seoTags.includes('name="description"') || seoTags.includes('name=\'description\''));
  
  const titleBlock = hasSeoTitle ? "" : `<title>${pageTitle}</title>`;
  const descBlock = hasSeoDesc ? "" : `<meta name="description" content="${metaDescription}">`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  ${descBlock}
  ${titleBlock}
  ${seoTags}
  <link rel="icon" type="image/png" href="https://ik.imagekit.io/ebn7n9wrv/favicon.png">
  <style>
    /* Main Stylesheet for B2B Website */

    :root {
      --primary-color: #ffd814;
      --primary-hover: #f7ca00;
      --secondary-color: #ffa41c;
      --secondary-hover: #e8910d;
      --accent-color: #febd69;
      --bg-dark: #131921;
      --bg-menu: #232f3e;
      --bg-light: #eaeded;
      --border-color: #ddd;
      --text-dark: #0f1111;
      --text-light: #565959;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      font-family: "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
      line-height: 1.5;
      color: var(--text-dark);
      background: var(--bg-light);
    }

    /* Navigation */
    .navbar {
      background: var(--bg-dark);
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .nav-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0.75rem 2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
    }

    .logo {
      font-size: 1.6rem;
      font-weight: 700;
      color: #ffffff;
      text-decoration: none;
      display: flex;
      align-items: center;
      letter-spacing: -0.03em;
    }
    
    .logo span {
      color: var(--secondary-color);
    }

    /* Unified Search Bar styling */
    .nav-search-form {
      display: flex;
      flex: 1;
      max-width: 750px;
      height: 40px;
      border-radius: 4px;
      overflow: hidden;
      background: white;
      box-shadow: 0 1px 2px rgba(0,0,0,0.1);
      transition: box-shadow 0.15s;
    }
    
    .nav-search-form:focus-within {
      box-shadow: 0 0 0 2px #e77600;
    }

    .nav-search-category {
      background: #f3f3f3;
      border: none;
      border-right: 1px solid #ddd;
      padding: 0 1rem;
      font-size: 0.82rem;
      font-weight: 500;
      cursor: pointer;
      outline: none;
      color: #555;
      max-width: 150px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    
    .nav-search-category:hover {
      background: #dadada;
      color: #111;
    }

    .nav-search-input {
      flex: 1;
      border: none;
      padding: 0 0.8rem;
      font-size: 0.95rem;
      outline: none;
      color: var(--text-dark);
      font-family: inherit;
    }

    .nav-search-submit {
      background: var(--accent-color);
      border: none;
      width: 45px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      transition: background 0.15s;
    }
    
    .nav-search-submit:hover {
      background: #f3a847;
    }

    .nav-right-actions {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      color: white;
      font-size: 0.85rem;
    }
    
    .nav-badge-box {
      border: 1px solid rgba(255,255,255,0.3);
      padding: 0.25rem 0.5rem;
      border-radius: 3px;
      font-weight: 600;
      background: rgba(255,255,255,0.05);
      color: var(--accent-color);
    }

    .subnav {
      background: var(--bg-menu);
      border-bottom: 1px solid rgba(0,0,0,0.1);
    }
    
    .subnav-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0.45rem 2rem;
      display: flex;
      gap: 1.5rem;
      align-items: center;
      list-style: none;
    }
    
    .subnav-link {
      color: #ffffff;
      text-decoration: none;
      font-size: 0.88rem;
      font-weight: 500;
      transition: color 0.15s;
    }
    
    .subnav-link:hover,
    .subnav-link.active {
      color: var(--accent-color);
    }

    /* Container */
    .container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 1.5rem 2rem;
    }

    /* Hero Section */
    .hero {
      background: linear-gradient(180deg, rgba(234,237,237,0) 0%, rgba(234,237,237,1) 100%), 
                  linear-gradient(135deg, #232f3e, #131921);
      color: white;
      padding: 3rem 2rem 5rem;
      text-align: center;
      position: relative;
    }

    .hero h1 {
      font-size: 2.2rem;
      font-weight: 700;
      margin-bottom: 0.75rem;
      letter-spacing: -0.02em;
    }

    .hero p {
      font-size: 1.1rem;
      max-width: 650px;
      margin: 0 auto;
      color: #d1d5db;
    }

    /* Buttons */
    .btn {
      display: inline-block;
      padding: 0.55rem 1.25rem;
      border-radius: 100px;
      text-decoration: none;
      font-weight: 500;
      transition: all 0.2s ease-in-out;
      border: 1px solid;
      cursor: pointer;
      text-align: center;
      font-size: 0.88rem;
      box-shadow: 0 2px 5px rgba(213,217,217,.5);
    }

    .btn-primary {
      background: #ffd814;
      border-color: #fcd200;
      color: #0f1111;
    }

    .btn-primary:hover {
      background: #f7ca00;
      border-color: #f2c200;
    }

    .btn-secondary {
      background: #ffa41c;
      border-color: #ff9900;
      color: #0f1111;
    }

    .btn-secondary:hover {
      background: #e8910d;
      border-color: #e08700;
    }

    /* Cards */
    .card {
      background: white;
      border-radius: 4px;
      border: 1px solid #ddd;
      overflow: hidden;
      transition: transform 0.2s, box-shadow 0.2s;
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      border-color: #ccc;
    }

    .card-image {
      width: 100%;
      height: 180px;
      object-fit: contain;
      background: #ffffff;
      padding: 0.5rem;
      border-bottom: 1px solid #eee;
    }

    .card-content {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .card-title {
      font-size: 1rem;
      font-weight: 600;
      margin-bottom: 0.4rem;
      color: #0f1111;
      line-height: 1.35;
    }

    .card-description {
      color: var(--text-light);
      font-size: 0.85rem;
      margin-bottom: 0.8rem;
      flex: 1;
    }

    /* Grid Layout */
    .grid {
      display: grid;
      gap: 1.5rem;
    }

    .grid-2 {
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      max-width: 100%;
    }

    .grid-3 {
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      max-width: 100%;
    }

    /* Limit card max width when there are few items */
    .grid > .card {
      max-width: none;
      width: 100%;
    }

    /* Form Styles */
    .form-group {
      margin-bottom: 1.2rem;
    }

    .form-label {
      display: block;
      margin-bottom: 0.4rem;
      font-weight: 600;
      font-size: 0.88rem;
      color: var(--text-dark);
    }

    .form-input,
    .form-textarea {
      width: 100%;
      padding: 0.5rem 0.75rem;
      border: 1px solid #a6a9a9;
      border-radius: 3px;
      font-size: 0.9rem;
      transition: border-color 0.15s, box-shadow 0.15s;
    }

    .form-input:focus,
    .form-textarea:focus {
      outline: none;
      border-color: #e77600;
      box-shadow: 0 0 3px rgba(228,121,17,0.5);
    }

    .form-textarea {
      resize: vertical;
      min-height: 120px;
    }

    /* Footer */
    .footer {
      background: #232f3e;
      color: white;
      padding: 0;
      margin-top: 4rem;
    }
    
    .footer-back-to-top {
      background: #37475a;
      color: white;
      text-align: center;
      padding: 0.9rem;
      font-size: 0.82rem;
      cursor: pointer;
      text-decoration: none;
      display: block;
      transition: background 0.15s;
    }
    
    .footer-back-to-top:hover {
      background: #485769;
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      gap: 2.5rem;
      padding: 3rem 2rem;
    }

    .footer-section h3 {
      font-size: 0.95rem;
      font-weight: 700;
      margin-bottom: 1rem;
      color: #ffffff;
    }

    .footer-section ul {
      list-style: none;
    }
    
    .footer-section ul li {
      margin-bottom: 0.5rem;
    }

    .footer-section a {
      color: #ddd;
      text-decoration: none;
      font-size: 0.82rem;
      transition: text-decoration 0.15s;
    }

    .footer-section a:hover {
      color: white;
      text-decoration: underline;
    }

    /* Footer quotes */
    .footer-quotes {
      min-width: 250px;
    }
    .quotes-slider {
      position: relative;
      min-height: 120px;
      display: flex;
      align-items: center;
    }
    .quote-item {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.5s ease-in-out, visibility 0.5s ease-in-out;
      font-style: italic;
      color: #d1d5db;
      font-size: 0.85rem;
      line-height: 1.6;
    }
    .quote-item.active {
      position: relative;
      opacity: 1;
      visibility: visible;
    }
    .quote-item q {
      quotes: none;
    }
    .quote-item q::before {
      content: none;
    }
    .quote-item q::after {
      content: none;
    }

    .footer-bottom {
      text-align: center;
      padding: 2rem;
      background: #131a22;
      color: #9ca3af;
      font-size: 0.8rem;
      border-top: 1px solid #19222d;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .nav-container {
        flex-direction: column;
        align-items: stretch;
        padding: 0.5rem 1rem;
        gap: 0.5rem;
      }
      
      .logo {
        justify-content: center;
      }
      
      .nav-search-form {
        max-width: none;
        order: 3;
      }
      
      .nav-right-actions {
        justify-content: center;
      }
      
      .subnav-container {
        padding: 0.5rem 1rem;
        flex-wrap: wrap;
        justify-content: center;
        gap: 1rem;
      }

      .grid-2,
      .grid-3 {
        grid-template-columns: 1fr;
      }

      .container {
        padding: 1rem;
      }
    }

    /* Loading Spinner */
    .spinner {
      border: 3px solid #f3f4f6;
      border-top: 3px solid var(--primary-color);
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin: 2rem auto;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  ${createNavbar()}

  <main>
    ${content}
  </main>

  ${createFooter(settings)}

  <script>
    /**
     * Main JavaScript file for B2B Website
     * Handles common functionality across all pages
     */

    // Mobile menu toggle
    document.addEventListener('DOMContentLoaded', function() {
      const menuToggle = document.querySelector('.menu-toggle');
      const navMenu = document.querySelector('.nav-menu');

      if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', function() {
          navMenu.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
          if (!menuToggle.contains(event.target) && !navMenu.contains(event.target)) {
            navMenu.classList.remove('active');
          }
        });
      }

      // Set active nav link based on current page
      const currentPath = window.location.pathname;
      const navLinks = document.querySelectorAll('.nav-link, .subnav-link');

      navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
          link.classList.add('active');
        }
      });

      // Quotes rotation loop (every 5 seconds)
      const quotes = document.querySelectorAll('.quote-item');
      if (quotes.length > 0) {
        let currentIndex = 0;
        setInterval(() => {
          quotes[currentIndex].classList.remove('active');
          currentIndex = (currentIndex + 1) % quotes.length;
          quotes[currentIndex].classList.add('active');
        }, 5000);
      }
    });

    // API helper functions
    const API = {
      baseURL: '/api',

      async get(endpoint) {
        const response = await fetch(\`\${this.baseURL}\${endpoint}\`);
        if (!response.ok) {
          throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        return await response.json();
      },

      async post(endpoint, data) {
        const response = await fetch(\`\${this.baseURL}\${endpoint}\`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        return await response.json();
      },

      async put(endpoint, data) {
        const response = await fetch(\`\${this.baseURL}\${endpoint}\`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        if (!response.ok) {
          throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        return await response.json();
      },

      async delete(endpoint) {
        const response = await fetch(\`\${this.baseURL}\${endpoint}\`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error(\`HTTP error! status: \${response.status}\`);
        }
        return await response.json();
      },
    };

    // Form validation helper
    function validateEmail(email) {
      const re = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
      return re.test(String(email).toLowerCase());
    }

    // Show notification
    function showNotification(message, type = 'info') {
      const notification = document.createElement('div');
      notification.className = \`notification notification-\${type}\`;
      notification.textContent = message;
      notification.style.cssText = \`
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: \${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        border-radius: 0.5rem;
        box-shadow: 0 10px 15px rgba(0,0,0,0.1);
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
      \`;

      document.body.appendChild(notification);

      setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
      }, 3000);
    }

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = \`
      @keyframes slideIn {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOut {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(100%);
          opacity: 0;
        }
      }
    \`;
    document.head.appendChild(style);

    // Load and apply website settings
    async function loadWebsiteSettings() {
      try {
        const response = await API.get('/settings');
        if (response.success) {
          const settings = response.data;

          // Update logo/site name
          const logo = document.querySelector('.logo');
          if (logo && settings.site_name) {
            logo.textContent = settings.site_name;
          }

          // Update footer quotes slider
          for (let i = 1; i <= 5; i++) {
            const quoteEl = document.querySelector(\`.quote-item[data-index="\${i-1}"] q\`);
            if (quoteEl && settings[\`quote_\${i}\`]) {
              quoteEl.textContent = settings[\`quote_\${i}\`];
            }
          }

          // Update footer Contact Info
          const contactItems = document.querySelectorAll('.footer-contact ul li');
          if (contactItems.length >= 2) {
            if (settings.email) contactItems[0].textContent = \`Email: \${settings.email}\`;
            if (settings.address) contactItems[1].textContent = \`Address: \${settings.address}\`;
          }

          // Update social media links
          const socialLinks = document.querySelectorAll('.footer-social ul li a');
          if (socialLinks.length >= 3) {
            const youtubeVal = settings.youtube || settings.linkedin;
            if (youtubeVal) {
              socialLinks[0].href = youtubeVal;
              if (youtubeVal === '#') socialLinks[0].parentElement.style.display = 'none';
            }
            if (settings.facebook) {
              socialLinks[1].href = settings.facebook;
              if (settings.facebook === '#') socialLinks[1].parentElement.style.display = 'none';
            }
            const xVal = settings.x || settings.twitter;
            if (xVal) {
              socialLinks[2].href = xVal;
              if (xVal === '#') socialLinks[2].parentElement.style.display = 'none';
            }
          }

          // Initialize widget mode from settings
          const widgetMode = settings.chat_widget_mode || 'live_chat';
          if (typeof window.initWidgetMode === 'function') {
            window.initWidgetMode(widgetMode);
          }
        }
      } catch (error) {
        console.error('Error loading website settings:', error);
        // Default to live_chat on error
        if (typeof window.initWidgetMode === 'function') {
          window.initWidgetMode('live_chat');
        }
      }
    }

    // Load settings on page load
    loadWebsiteSettings();

    // ImageKit helper
    window.getImageKitUrl = function(url, transformations = '') {
      if (!url || typeof url !== 'string' || !url.includes('ik.imagekit.io')) return url || '';
      
      try {
        const urlObj = new URL(url);
        if (transformations) {
          urlObj.searchParams.set('tr', transformations);
        }
        return urlObj.toString();
      } catch (e) {
        return url;
      }
    };

    // Export for use in other scripts
    window.API = API;
    window.validateEmail = validateEmail;
    window.showNotification = showNotification;
  </script>
  ${additionalScripts}

  <!-- Chat Widget -->
  <style>
    #chat-bubble {
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 9999;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background: var(--primary-color);
      color: white;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(37,99,235,0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    #chat-bubble:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 20px rgba(37,99,235,0.5);
    }
    #chat-unread-badge {
      position: absolute;
      top: -2px;
      right: -2px;
      background: #ef4444;
      color: white;
      border-radius: 9999px;
      width: 20px;
      height: 20px;
      font-size: 0.7rem;
      font-weight: 700;
      display: none;
      align-items: center;
      justify-content: center;
      border: 2px solid white;
    }
    #chat-panel {
      position: fixed;
      bottom: 92px;
      right: 24px;
      z-index: 9998;
      width: 350px;
      height: 500px;
      background: white;
      border-radius: 1rem;
      box-shadow: 0 8px 32px rgba(0,0,0,0.18);
      display: none;
      flex-direction: column;
      overflow: hidden;
      animation: chatSlideUp 0.2s ease-out;
    }
    #chat-panel.open {
      display: flex;
    }
    @keyframes chatSlideUp {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    #chat-panel-header {
      background: var(--primary-color);
      color: white;
      padding: 0.9rem 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
    }
    #chat-panel-header h3 {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
    }
    #chat-panel-header p {
      margin: 0.1rem 0 0;
      font-size: 0.78rem;
      opacity: 0.85;
    }
    #chat-close-btn {
      background: none;
      border: none;
      color: white;
      font-size: 1.3rem;
      cursor: pointer;
      line-height: 1;
      padding: 0 0.25rem;
      opacity: 0.85;
    }
    #chat-close-btn:hover { opacity: 1; }
    #chat-messages {
      flex: 1;
      overflow-y: auto;
      padding: 0.9rem;
      display: flex;
      flex-direction: column;
      gap: 0.6rem;
      background: #f9fafb;
    }
    .chat-msg-row {
      display: flex;
      flex-direction: column;
    }
    .chat-msg-row.visitor { align-items: flex-end; }
    .chat-msg-row.admin   { align-items: flex-start; }
    .chat-msg-bubble {
      max-width: 80%;
      padding: 0.55rem 0.85rem;
      border-radius: 1rem;
      font-size: 0.88rem;
      line-height: 1.45;
      word-break: break-word;
    }
    .chat-msg-row.visitor .chat-msg-bubble {
      background: var(--primary-color);
      color: white;
      border-bottom-right-radius: 0.25rem;
    }
    .chat-msg-row.admin .chat-msg-bubble {
      background: white;
      color: var(--text-dark);
      border-bottom-left-radius: 0.25rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }
    .chat-msg-time {
      font-size: 0.7rem;
      color: var(--text-light);
      margin-top: 0.15rem;
      padding: 0 0.2rem;
    }
    #chat-input-area {
      padding: 0.75rem;
      border-top: 1px solid var(--border-color);
      display: flex;
      gap: 0.5rem;
      flex-shrink: 0;
      background: white;
    }
    #chat-message-input {
      flex: 1;
      padding: 0.6rem 0.8rem;
      border: 1px solid var(--border-color);
      border-radius: 0.375rem;
      font-size: 0.9rem;
      outline: none;
      transition: border-color 0.2s;
    }
    #chat-message-input:focus { border-color: var(--primary-color); }
    #chat-send-btn {
      padding: 0.6rem 1rem;
      background: var(--primary-color);
      color: white;
      border: none;
      border-radius: 0.375rem;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
      white-space: nowrap;
    }
    #chat-send-btn:hover { background: var(--secondary-color); }
    #chat-send-btn:disabled { opacity: 0.6; cursor: not-allowed; }
    @media (max-width: 480px) {
      #chat-panel {
        width: calc(100vw - 16px);
        right: 8px;
        bottom: 84px;
        height: 420px;
      }
      #chat-bubble { bottom: 16px; right: 16px; }
    }

    /* Contact Form Panel */
    #contact-form-panel {
      position: fixed;
      bottom: 92px;
      right: 24px;
      z-index: 9998;
      width: 350px;
      background: white;
      border-radius: 1rem;
      box-shadow: 0 8px 32px rgba(0,0,0,0.18);
      display: none;
      flex-direction: column;
      overflow: hidden;
      animation: chatSlideUp 0.2s ease-out;
    }
    #contact-form-panel.open {
      display: flex;
    }
    #cfp-header {
      background: var(--primary-color);
      color: white;
      padding: 0.9rem 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
    }
    #cfp-header h3 {
      margin: 0;
      font-size: 1rem;
      font-weight: 600;
    }
    #cfp-close-btn {
      background: none;
      border: none;
      color: white;
      font-size: 1.3rem;
      cursor: pointer;
      line-height: 1;
      padding: 0 0.25rem;
      opacity: 0.85;
    }
    #cfp-close-btn:hover { opacity: 1; }
    #cfp-body {
      padding: 1rem;
      overflow-y: auto;
      max-height: 420px;
    }
    #cfp-body .form-group {
      margin-bottom: 1rem;
    }
    #cfp-body .form-label {
      display: block;
      margin-bottom: 0.35rem;
      font-size: 0.88rem;
      font-weight: 500;
      color: var(--text-dark);
    }
    #cfp-body .form-input,
    #cfp-body .form-textarea {
      width: 100%;
      padding: 0.55rem 0.75rem;
      border: 1px solid var(--border-color);
      border-radius: 0.375rem;
      font-size: 0.9rem;
      font-family: inherit;
      transition: border-color 0.2s;
      box-sizing: border-box;
    }
    #cfp-body .form-input:focus,
    #cfp-body .form-textarea:focus {
      outline: none;
      border-color: var(--primary-color);
    }
    #cfp-body .form-textarea {
      resize: vertical;
      min-height: 90px;
    }
    #cfp-submit-btn {
      width: 100%;
      padding: 0.65rem 1rem;
      background: var(--primary-color);
      color: white;
      border: none;
      border-radius: 0.375rem;
      font-size: 0.95rem;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.2s;
      margin-top: 0.25rem;
    }
    #cfp-submit-btn:hover { background: var(--secondary-color); }
    #cfp-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }
    #cfp-success-msg,
    #cfp-error-msg {
      padding: 0.75rem 1rem;
      font-size: 0.88rem;
      border-top: 1px solid var(--border-color);
    }
    #cfp-success-msg {
      color: #065f46;
      background: #d1fae5;
    }
    #cfp-error-msg {
      color: #991b1b;
      background: #fee2e2;
    }
    .cfp-field-error {
      color: #ef4444;
      font-size: 0.78rem;
      margin-top: 0.25rem;
      display: none;
    }
    @media (max-width: 480px) {
      #contact-form-panel {
        width: calc(100vw - 16px);
        right: 8px;
        bottom: 84px;
      }
    }
  </style>

  <!-- Chat Bubble Button -->
  <button id="chat-bubble" aria-label="Open chat" onclick="toggleChatPanel()">
    💬
    <span id="chat-unread-badge"></span>
  </button>

  <!-- Chat Panel -->
  <div id="chat-panel" role="dialog" aria-label="Live chat">
    <div id="chat-panel-header">
      <div>
        <h3>Chat with us</h3>
        <p id="chat-status-text">We typically reply within minutes</p>
      </div>
      <button id="chat-close-btn" onclick="toggleChatPanel()" aria-label="Close chat">✕</button>
    </div>

    <!-- Name entry screen removed — session auto-starts on open -->

    <!-- Messages screen -->
    <div id="chat-messages"></div>
    <div id="chat-input-area">
      <input id="chat-message-input" type="text" placeholder="Type a message..."
             maxlength="2000" onkeypress="if(event.key==='Enter') sendChatMessage()">
      <button id="chat-send-btn" onclick="sendChatMessage()">Send</button>
    </div>
  </div>

  <!-- Contact Form Panel -->
  <div id="contact-form-panel" role="dialog" aria-label="Contact form" style="display:none;">
    <div id="cfp-header">
      <h3>Send us a message</h3>
      <button id="cfp-close-btn" aria-label="Close contact form" onclick="toggleContactFormPanel()">✕</button>
    </div>
    <div id="cfp-body">
      <form id="cfp-form" novalidate>
        <div class="form-group">
          <label class="form-label" for="cfp-name">Name</label>
          <input id="cfp-name" class="form-input" type="text" name="name"
                 placeholder="Your name (optional)" autocomplete="name">
        </div>
        <div class="form-group">
          <label class="form-label" for="cfp-email">Email <span aria-hidden="true">*</span></label>
          <input id="cfp-email" class="form-input" type="email" name="email"
                 placeholder="your@email.com" required autocomplete="email">
          <div id="cfp-email-error" class="cfp-field-error" role="alert">Please enter a valid email address.</div>
        </div>
        <div class="form-group">
          <label class="form-label" for="cfp-phone">Phone</label>
          <input id="cfp-phone" class="form-input" type="tel" name="phone"
                 placeholder="Your phone (optional)" autocomplete="tel">
        </div>
        <div class="form-group">
          <label class="form-label" for="cfp-message">Message <span aria-hidden="true">*</span></label>
          <textarea id="cfp-message" class="form-textarea" name="message"
                    placeholder="How can we help you?" required></textarea>
          <div id="cfp-message-error" class="cfp-field-error" role="alert">Please enter a message.</div>
        </div>
        <button id="cfp-submit-btn" type="submit">Send Message</button>
      </form>
    </div>
    <div id="cfp-success-msg" style="display:none;" role="status">
      ✓ Your message has been sent. We'll be in touch soon!
    </div>
    <div id="cfp-error-msg" style="display:none;" role="alert">
      Something went wrong. Please try again.
    </div>
  </div>

  <script>
    (function() {
      const POLL_INTERVAL = 3000;
      let chatSessionId = sessionStorage.getItem('chat_session_id');
      let chatVisitorName = sessionStorage.getItem('chat_visitor_name');
      let lastMsgId = parseInt(sessionStorage.getItem('chat_last_msg_id') || '0', 10);
      let pollTimer = null;
      let unreadCount = 0;
      let panelOpen = false;
      let sessionReady = false;
      let widgetMode = 'live_chat';

      // STATE ISOLATION GUARD: toggleContactFormPanel() only manipulates the
      // #contact-form-panel DOM element and the bubble icon. It does NOT read
      // from or write to any live chat IIFE variables (chatSessionId,
      // lastMsgId, pollTimer, panelOpen, sessionReady, unreadCount,
      // chatVisitorName).
      // When widgetMode is 'live_chat', "Send Inquiry" should open the chat
      // panel instead of the (hidden) contact form panel.
      function toggleContactFormPanel() {
        if (widgetMode === 'live_chat') {
          // In live chat mode, open the chat panel instead
          window.toggleChatPanel();
          return;
        }

        const cfpPanel = document.getElementById('contact-form-panel');
        if (!cfpPanel) return;

        const isOpen = cfpPanel.classList.contains('open');
        cfpPanel.classList.toggle('open', !isOpen);

        document.getElementById('chat-bubble').innerHTML = !isOpen
          ? '✕<span id="chat-unread-badge" style="display:none"></span>'
          : '💬<span id="chat-unread-badge" style="display:none"></span>';

        if (!isOpen) {
          // Panel is now open — focus first input
          setTimeout(() => {
            const firstInput = cfpPanel.querySelector('input, textarea');
            if (firstInput) firstInput.focus();
          }, 100);
        }
      }

      // Expose toggleContactFormPanel IMMEDIATELY at the start of the IIFE
      // to ensure it's accessible when product-detail.js "Send Inquiry" button is clicked
      window.toggleContactFormPanel = toggleContactFormPanel;

      function generateId() {
        return crypto.randomUUID
          ? crypto.randomUUID()
          : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
              const r = Math.random() * 16 | 0;
              return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
            });
      }

      function generateVisitorName() {
        return 'Visitor #' + Math.random().toString(36).slice(2, 6).toUpperCase();
      }

      // Restore session if exists
      window.addEventListener('DOMContentLoaded', function() {
        if (chatSessionId && chatVisitorName) {
          sessionReady = true;
          loadChatHistory();
        }
      });

      window.toggleChatPanel = function() {
        if (widgetMode !== 'live_chat') {
          toggleContactFormPanel();
          return;
        }

        panelOpen = !panelOpen;
        const panel = document.getElementById('chat-panel');
        panel.classList.toggle('open', panelOpen);
        document.getElementById('chat-bubble').innerHTML = panelOpen
          ? '✕<span id="chat-unread-badge" style="display:none"></span>'
          : '💬<span id="chat-unread-badge" style="display:none"></span>';

        if (panelOpen) {
          clearUnreadBadge();
          if (!sessionReady) {
            initSession();
          } else {
            startPolling();
            scrollChatToBottom();
            setTimeout(() => document.getElementById('chat-message-input').focus(), 100);
          }
        } else {
          stopPolling();
        }
      };

      // STATE ISOLATION GUARD: initWidgetMode() only sets the module-level
      // widgetMode variable and manipulates the #contact-form-panel DOM element.
      // It does NOT modify chatSessionId, lastMsgId, pollTimer, panelOpen,
      // sessionReady, unreadCount, or chatVisitorName.
      window.initWidgetMode = function(mode) {
        const validModes = ['live_chat', 'contact_form'];
        widgetMode = validModes.includes(mode) ? mode : 'live_chat';

        const cfpPanel = document.getElementById('contact-form-panel');

        if (widgetMode === 'contact_form') {
          // Contact form mode: ensure contact form panel is available but hidden until clicked
          // Do NOT initialize live chat session or start polling
          if (cfpPanel) {
            cfpPanel.style.display = '';
            cfpPanel.classList.remove('open');
          }
        } else {
          // Live chat mode: hide/remove contact form panel, preserve existing behavior
          if (cfpPanel) {
            cfpPanel.style.display = 'none';
            cfpPanel.classList.remove('open');
          }
        }
      };

      // STATE ISOLATION GUARD: submitContactForm() operates exclusively on
      // contact form panel DOM elements (#cfp-*). It does NOT read from or
      // write to any live chat IIFE variables (chatSessionId, lastMsgId,
      // pollTimer, panelOpen, sessionReady, unreadCount, chatVisitorName).
      async function submitContactForm() {
        const emailInput = document.getElementById('cfp-email');
        const messageInput = document.getElementById('cfp-message');
        const emailError = document.getElementById('cfp-email-error');
        const messageError = document.getElementById('cfp-message-error');
        const submitBtn = document.getElementById('cfp-submit-btn');
        const successMsg = document.getElementById('cfp-success-msg');
        const errorMsg = document.getElementById('cfp-error-msg');

        // Reset previous feedback
        emailError.style.display = 'none';
        messageError.style.display = 'none';
        successMsg.style.display = 'none';
        errorMsg.style.display = 'none';

        const email = emailInput.value.trim();
        const message = messageInput.value.trim();

        // Validate email
        if (!email || !validateEmail(email)) {
          emailError.style.display = 'block';
          emailInput.focus();
          return;
        }

        // Validate message
        if (!message) {
          messageError.style.display = 'block';
          messageInput.focus();
          return;
        }

        const name = (document.getElementById('cfp-name').value || '').trim();
        const phone = (document.getElementById('cfp-phone').value || '').trim();

        // Disable submit button during in-flight request
        submitBtn.disabled = true;

        try {
          await API.post('/inquiries', { name, email, phone, message });

          // Success: show success message, reset form fields
          successMsg.style.display = 'block';
          document.getElementById('cfp-form').reset();
        } catch (err) {
          // Error: show error message, retain entered data
          errorMsg.style.display = 'block';
          console.error('Contact form submission error:', err);
        } finally {
          submitBtn.disabled = false;
        }
      }

      // Wire form submit event
      document.getElementById('cfp-form').addEventListener('submit', function(e) {
        e.preventDefault();
        submitContactForm();
      });

      async function initSession() {
        if (sessionReady) return;

        // Show a subtle loading state
        const msgArea = document.getElementById('chat-messages');
        msgArea.innerHTML = \`<div style="text-align:center; color: var(--text-light); padding: 2rem; font-size: 0.88rem;">Connecting...</div>\`;

        try {
          chatSessionId = generateId();
          chatVisitorName = generateVisitorName();

          const res = await fetch('/api/chat/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              session_id: chatSessionId,
              visitor_name: chatVisitorName,
              page_url: window.location.pathname
            })
          });
          const data = await res.json();
          if (!data.success) throw new Error(data.error || 'Failed to connect');

          sessionStorage.setItem('chat_session_id', chatSessionId);
          sessionStorage.setItem('chat_visitor_name', chatVisitorName);
          sessionStorage.setItem('chat_last_msg_id', '0');
          lastMsgId = 0;
          sessionReady = true;

          msgArea.innerHTML = '';
          document.getElementById('chat-status-text').textContent = 'How can we help you today?';
          startPolling();
          setTimeout(() => document.getElementById('chat-message-input').focus(), 100);
        } catch (err) {
          const msgArea = document.getElementById('chat-messages');
          msgArea.innerHTML = \`<div style="text-align:center; color:#ef4444; padding: 2rem; font-size: 0.88rem;">Connection failed. Please try again.</div>\`;
          console.error('Chat session error:', err);
        }
      }

      window.sendChatMessage = async function() {
        const input = document.getElementById('chat-message-input');
        const sendBtn = document.getElementById('chat-send-btn');
        const message = input.value.trim();
        if (!message || !chatSessionId) return;

        input.value = '';
        input.disabled = true;
        sendBtn.disabled = true;

        // Optimistic render
        appendChatMessage({ sender_type: 'visitor', sender_name: chatVisitorName, message, created_at: new Date().toISOString() });

        try {
          const res = await fetch('/api/chat/message', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              session_id: chatSessionId,
              sender_type: 'visitor',
              sender_name: chatVisitorName,
              message
            })
          });
          const data = await res.json();
          if (!data.success) throw new Error(data.error);
        } catch (err) {
          console.error('Send error:', err);
        } finally {
          input.disabled = false;
          sendBtn.disabled = false;
          input.focus();
        }
      };

      async function loadChatHistory() {
        if (!chatSessionId) return;
        try {
          const res = await fetch(\`/api/chat/messages?session_id=\${chatSessionId}&after=0\`);
          const data = await res.json();
          if (!data.success) return;
          const msgs = data.data || [];
          const container = document.getElementById('chat-messages');
          container.innerHTML = '';
          msgs.forEach(appendChatMessage);
          if (msgs.length > 0) {
            lastMsgId = msgs[msgs.length - 1].id;
            sessionStorage.setItem('chat_last_msg_id', lastMsgId);
          }
          scrollChatToBottom();
        } catch (err) {
          console.error('Load history error:', err);
        }
      }

      async function pollMessages() {
        if (!chatSessionId) return;
        try {
          const res = await fetch(\`/api/chat/messages?session_id=\${chatSessionId}&after=\${lastMsgId}\`);
          const data = await res.json();
          if (!data.success) return;
          const msgs = data.data || [];
          if (msgs.length === 0) return;

          msgs.forEach(msg => {
            appendChatMessage(msg);
            // Show badge for admin replies when panel is closed
            if (msg.sender_type === 'admin' && !panelOpen) {
              unreadCount++;
              showUnreadBadge(unreadCount);
            }
          });
          lastMsgId = msgs[msgs.length - 1].id;
          sessionStorage.setItem('chat_last_msg_id', lastMsgId);
          if (panelOpen) scrollChatToBottom();
        } catch (err) {
          console.error('Poll error:', err);
        }
      }

      function startPolling() {
        stopPolling();
        pollTimer = setInterval(pollMessages, POLL_INTERVAL);
      }

      function stopPolling() {
        if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
      }

      function appendChatMessage(msg) {
        const container = document.getElementById('chat-messages');
        if (!container) return;
        const isVisitor = msg.sender_type === 'visitor';
        const time = new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const row = document.createElement('div');
        row.className = \`chat-msg-row \${isVisitor ? 'visitor' : 'admin'}\`;
        row.innerHTML = \`
          <div class="chat-msg-bubble">\${escapeHtml(msg.message)}</div>
          <span class="chat-msg-time">\${isVisitor ? 'You' : msg.sender_name} · \${time}</span>
        \`;
        container.appendChild(row);
      }

      function scrollChatToBottom() {
        const c = document.getElementById('chat-messages');
        if (c) c.scrollTop = c.scrollHeight;
      }

      function showUnreadBadge(count) {
        const badge = document.getElementById('chat-unread-badge');
        if (badge) {
          badge.textContent = count;
          badge.style.display = 'flex';
        }
      }

      function clearUnreadBadge() {
        unreadCount = 0;
        const badge = document.getElementById('chat-unread-badge');
        if (badge) badge.style.display = 'none';
      }

      function escapeHtml(str) {
        return String(str)
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      }

      // Keep polling when tab is visible, pause when hidden
      document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
          stopPolling();
        } else if (panelOpen && chatSessionId) {
          startPolling();
        }
      });
    })();
  </script>
</body>
</html>`;
}

function createNavbar() {
  return `
  <nav class="navbar">
    <div class="nav-container">
      <a href="/" class="logo">GlobalMart<span>.kz</span></a>
      
      <!-- Unified Search Bar -->
      <form class="nav-search-form" action="/products" method="GET" onsubmit="event.preventDefault(); window.location.href='/products?q=' + encodeURIComponent(this.querySelector('.nav-search-input').value) + '&category=' + encodeURIComponent(this.querySelector('.nav-search-category').value);">
        <select class="nav-search-category" name="category">
          <option value="">All Departments</option>
          <option value="Industrial">Industrial</option>
          <option value="Technology">Technology</option>
          <option value="Equipment">Equipment</option>
        </select>
        <input class="nav-search-input" type="text" name="q" placeholder="Search for wholesale garments, fabrics, yarn..." autocomplete="off">
        <button class="nav-search-submit" type="submit" aria-label="Search">🔍</button>
      </form>
      
      <div class="nav-right-actions">
        <div style="text-align: right; line-height: 1.2;">
          <div style="font-size: 0.72rem; opacity: 0.8; font-weight: 500; color: #aaa;">B2B Wholesale</div>
          <div style="font-weight: 700; font-size: 0.88rem; color: #fff;">Kazakhstan Hub</div>
        </div>
        <div class="nav-badge-box">Verified Trade</div>
      </div>
    </div>
  </nav>
  <div class="subnav">
    <ul class="subnav-container">
      <li><a href="/" class="subnav-link">Home</a></li>
      <li><a href="/products" class="subnav-link">Products</a></li>
      <li><a href="/about" class="subnav-link">About Us</a></li>
      <li><a href="/contact" class="subnav-link">Contact</a></li>
    </ul>
  </div>`;
}

function createFooter(settings = null) {
  // Fallback default famous quotes
  const quote_1 = settings?.quote_1 || "The only way to do great work is to love what you do. - Steve Jobs";
  const quote_2 = settings?.quote_2 || "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill";
  const quote_3 = settings?.quote_3 || "Believe you can and you're halfway there. - Theodore Roosevelt";
  const quote_4 = settings?.quote_4 || "Strive not to be a success, but rather to be of value. - Albert Einstein";
  const quote_5 = settings?.quote_5 || "Do what you can, with what you have, where you are. - Theodore Roosevelt";

  return `
  <footer class="footer">
    <a href="#" class="footer-back-to-top" onclick="window.scrollTo({top:0, behavior:'smooth'}); return false;">Back to top</a>
    <div class="footer-content">
      <div class="footer-section footer-links">
        <h3>Quick Links</h3>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/products">Products</a></li>
          <li><a href="/about">About Us</a></li>
          <li><a href="/contact">Contact</a></li>
        </ul>
      </div>
      <div class="footer-section footer-contact">
        <h3>Contact Info</h3>
        <ul>
          <li>Email: info@example.com</li>
          <li>Address: 123 Business St, City, Country</li>
        </ul>
      </div>
      <div class="footer-section footer-social">
        <h3>Follow Us</h3>
        <ul>
          <li><a href="#" target="_blank">YouTube</a></li>
          <li><a href="#" target="_blank">Facebook</a></li>
          <li><a href="#" target="_blank">X</a></li>
        </ul>
      </div>
      <div class="footer-section footer-quotes">
        <div class="quotes-slider">
          <blockquote class="quote-item active" data-index="0">
            <q>${quote_1}</q>
          </blockquote>
          <blockquote class="quote-item" data-index="1">
            <q>${quote_2}</q>
          </blockquote>
          <blockquote class="quote-item" data-index="2">
            <q>${quote_3}</q>
          </blockquote>
          <blockquote class="quote-item" data-index="3">
            <q>${quote_4}</q>
          </blockquote>
          <blockquote class="quote-item" data-index="4">
            <q>${quote_5}</q>
          </blockquote>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; ${new Date().getFullYear()} B2B Product Exhibition. All rights reserved. | <a href="/admin" style="color: var(--accent-color); text-decoration: none; margin-left: 1rem;">Admin Login</a></p>
    </div>
  </footer>`;
}
