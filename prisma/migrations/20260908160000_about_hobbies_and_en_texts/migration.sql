-- AboutPage: EN texty (koníčky řeší migrace hobbies_as_model)
ALTER TABLE "about_page" ADD COLUMN "intro_en" TEXT;

-- Skill, Language, Education, JobExperience
ALTER TABLE "skills" ADD COLUMN "name_en" TEXT;
ALTER TABLE "languages" ADD COLUMN "name_en" TEXT;
ALTER TABLE "education" ADD COLUMN "school_en" TEXT;
ALTER TABLE "job_experiences" ADD COLUMN "description_en" TEXT;

-- PortfolioPage
ALTER TABLE "portfolio_page" ADD COLUMN "intro_en" TEXT;

-- Project
ALTER TABLE "projects" ADD COLUMN "description_en" TEXT;

-- SiteSettings
ALTER TABLE "site_settings" ADD COLUMN "site_title_en" TEXT;
ALTER TABLE "site_settings" ADD COLUMN "site_description_en" TEXT;
ALTER TABLE "site_settings" ADD COLUMN "keywords_en" TEXT;
ALTER TABLE "site_settings" ADD COLUMN "contact_header_en" TEXT;
ALTER TABLE "site_settings" ADD COLUMN "form_header_en" TEXT;
ALTER TABLE "site_settings" ADD COLUMN "form_name_label_en" TEXT;
ALTER TABLE "site_settings" ADD COLUMN "form_email_label_en" TEXT;
ALTER TABLE "site_settings" ADD COLUMN "form_message_label_en" TEXT;
ALTER TABLE "site_settings" ADD COLUMN "form_submit_label_en" TEXT;
