# Club Recruitment System for Sandip University

A comprehensive club recruitment system with form submission, data validation, and admin dashboard - integrated with Supabase for backend data management.

## 🌟 Features

### Student Application Form (`club-recruitment.html`)
- **Clean, Modern Design** - Follows the existing website design language
- **Comprehensive Form Fields**:
  - Full Name (required)
  - Email (required) 
  - Phone Number (optional)
  - College, Branch & Year (required)
  - Club Selection (multi-select, required)
  - Reason to Join (required, min 50 chars)
  - Portfolio/Resume URL (optional)
  - Data Consent Checkbox (required)
- **Real-time Validation** - Instant feedback on form fields
- **Responsive Design** - Works perfectly on mobile and desktop
- **Supabase Integration** - Secure data storage and retrieval
- **User Experience**:
  - Auto-expanding textarea
  - Visual club selection with checkboxes
  - Loading states and success/error feedback
  - Form reset after successful submission

### Admin Dashboard (`admin-dashboard.html`)
- **Application Management** - View all submitted applications
- **Statistics Overview** - Total, today, and weekly application counts
- **Advanced Filtering**:
  - Filter by club selection
  - Search by name or email
  - Sort by date, name, or email
- **Data Export** - Export filtered results to CSV
- **Detailed View** - Modal popup for full application details
- **Pagination** - Handle large datasets efficiently
- **Responsive Design** - Mobile-friendly admin interface

### Available Clubs
- Tech Club
- Entrepreneurship Club
- Cultural Club
- Sports Club
- Debate Club
- Music Club
- Dance Club
- Photography Club
- Community Service
- Gaming Club

## 🚀 Quick Start

### 1. Set Up Supabase

1. **Create Supabase Project**:
   - Go to [https://supabase.com](https://supabase.com)
   - Sign up/Login and create a new project
   - Choose project name: `sunclubs-recruitment`
   - Set a strong database password
   - Wait for project creation (1-2 minutes)

2. **Create Database Table**:
   - In Supabase Dashboard → SQL Editor
   - Copy and run the SQL from `SUPABASE_SETUP.md`
   - This creates the `club_applications` table with proper structure

3. **Get API Credentials**:
   - Go to Settings → API in your Supabase dashboard
   - Copy your Project URL and Anon/Public Key

### 2. Configure the Application

1. **Update Supabase Configuration**:
   ```javascript
   // In js/supabase-config.js
   const SUPABASE_CONFIG = {
       url: 'https://your-project-id.supabase.co',
       anonKey: 'your-anon-key-here'
   };
   ```

2. **Test the Setup**:
   - Open `club-recruitment.html` in your browser
   - Fill out and submit the form with test data
   - Check Supabase Dashboard → Table Editor → club_applications
   - Verify your test submission appears

### 3. Deploy (Optional)

The system works with any static hosting:

- **GitHub Pages**: Push to a repository and enable Pages
- **Netlify**: Drag and drop the entire folder
- **Vercel**: Connect your GitHub repository
- **Traditional Hosting**: Upload files via FTP

## 📁 File Structure

```
sunclubs/
├── club-recruitment.html      # Main application form
├── admin-dashboard.html       # Admin interface
├── js/
│   └── supabase-config.js    # Supabase configuration
├── css/                      # Existing stylesheets
│   ├── root.css             # CSS variables
│   ├── main.css             # Main styles
│   ├── components.css       # Component styles
│   └── responsive.css       # Mobile styles
├── SUPABASE_SETUP.md        # Detailed setup instructions
└── README.md                # This file
```

## 🔧 Customization

### Adding New Clubs

1. **Update the HTML** (`club-recruitment.html`):
   ```html
   <div class="club-option" data-club="your-new-club">
       <div class="club-checkbox"></div>
       <span class="club-label">Your New Club</span>
   </div>
   ```

2. **Update the Configuration** (`js/supabase-config.js`):
   ```javascript
   const AVAILABLE_CLUBS = [
       // ...existing clubs...
       { id: 'your-new-club', name: 'Your New Club' }
   ];
   ```

### Modifying Form Fields

1. **Add HTML Input**:
   ```html
   <div class="form-group">
       <label class="form-label required">New Field</label>
       <input type="text" id="newField" class="form-input" required>
       <div class="error-message" id="newField-error"></div>
   </div>
   ```

2. **Update Database Schema**:
   ```sql
   ALTER TABLE club_applications ADD COLUMN new_field text;
   ```

3. **Update JavaScript**:
   - Add validation rules in `js/supabase-config.js`
   - Update `getFormData()` function to include new field

### Styling Changes

The system uses CSS custom properties (variables) defined in `css/root.css`:

```css
:root {
    --yellow: #FAD133;
    --white: #ffffff;
    --black: #090909;
    --grey: #737373;
    /* ... more variables ... */
}
```

Modify these variables to change the color scheme across the entire system.

## 🔒 Security

- **Row Level Security (RLS)** enabled on Supabase
- **Anonymous submissions** allowed for the form
- **Authenticated access** required for admin dashboard
- **Data validation** on both client and server side
- **HTTPS encryption** for all data transmission

## 📊 Data Structure

Each application record contains:

```javascript
{
    id: 'uuid',                    // Unique identifier
    full_name: 'string',           // Student name
    email: 'string',               // Email address
    phone: 'string|null',          // Phone (optional)
    college_info: 'string',        // College details
    selected_clubs: ['array'],     // Selected clubs
    reason: 'string',              // Why they want to join
    portfolio_url: 'string|null',  // Portfolio URL (optional)
    consent_given: boolean,        // Data consent
    created_at: 'timestamp',       // Submission time
    updated_at: 'timestamp'        // Last update time
}
```

## 🛠️ Troubleshooting

### Common Issues

**Form submission fails**:
- Check browser console for errors
- Verify Supabase credentials in `js/supabase-config.js`
- Ensure database table exists
- Check network connectivity

**Can't see applications in dashboard**:
- Verify you're in the correct Supabase project
- Check Table Editor → club_applications
- Ensure proper RLS policies are set

**Styling issues**:
- Clear browser cache
- Check if all CSS files are loading
- Verify file paths are correct

**Mobile responsiveness**:
- Test on actual devices or browser dev tools
- Check viewport meta tag is present
- Verify responsive CSS is loading

### Getting Help

1. **Check the browser console** for JavaScript errors
2. **Review Supabase logs** in the dashboard
3. **Test with sample data** to isolate issues
4. **Refer to documentation**:
   - [Supabase Docs](https://supabase.com/docs)
   - [JavaScript Form Validation](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation)

## 🚀 Advanced Features

### Email Notifications
Add Supabase Edge Functions to send emails when applications are submitted:

```sql
-- Example trigger for email notifications
CREATE OR REPLACE FUNCTION notify_new_application()
RETURNS TRIGGER AS $$
BEGIN
    -- Add your notification logic here
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_application_created
    AFTER INSERT ON club_applications
    FOR EACH ROW EXECUTE FUNCTION notify_new_application();
```

### Analytics Integration
Add Google Analytics or other tracking:

```html
<!-- Add to <head> section -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Additional Integrations
- **Discord Webhook** for real-time notifications
- **Slack Integration** for team notifications  
- **Google Sheets** for automatic data backup
- **PDF Generation** for application reports

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Developed for Sandip University Student Clubs** 🎓

For questions or support, please create an issue in the repository or contact the development team.
