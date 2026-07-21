// Central registry of everything editable in the CMS.
// Every content block (site section) and collection is described here;
// the admin panel renders forms straight from these definitions.

export type FieldType = "text" | "textarea" | "image" | "list" | "color";

export interface Field {
  name: string;
  label: string;
  type: FieldType;
  help?: string;
  // for type "list": the fields of each item
  of?: Field[];
}

export interface BlockSchema {
  key: string;
  label: string;
  group: "Global" | "Home" | "About" | "Pages";
  // Global blocks (e.g. site settings) are shared across all locations and
  // always stored under the bare key; per-location blocks use a slug namespace.
  global?: boolean;
  fields: Field[];
}

// Fields for the per-location branding/contact record (the `locations` table).
export const LOCATION_FIELDS: Field[] = [
  { name: "area", label: "Location name / area", type: "text" },
  { name: "tagline", label: "Tagline / one-liner", type: "text" },
  { name: "logo", label: "Header logo", type: "image" },
  { name: "logo_white", label: "Footer / dark-bg logo (white)", type: "image" },
  { name: "hero_image", label: "Chooser hero image", type: "image" },
  { name: "color_primary", label: "Primary color", type: "color" },
  { name: "color_primary_dark", label: "Primary color (dark / hover)", type: "color" },
  { name: "color_accent", label: "Accent color", type: "color" },
  { name: "color_accent_dark", label: "Accent color (dark / hover)", type: "color" },
  { name: "color_gold", label: "Highlight / gold color", type: "color" },
  { name: "phone", label: "Phone", type: "text" },
  { name: "toll_free", label: "Toll-free", type: "text" },
  { name: "email", label: "Email", type: "text" },
  { name: "form_email", label: "Contact form recipient email", type: "text" },
  { name: "address", label: "Address", type: "text" },
  { name: "map_embed_src", label: "Google Maps embed URL", type: "textarea" },
  { name: "directions_url", label: "Google Maps directions link", type: "text" },
  { name: "google_reviews_url", label: "Google review link", type: "text" },
  { name: "facebook", label: "Facebook URL", type: "text" },
  { name: "instagram", label: "Instagram URL", type: "text" },
  {
    name: "hours", label: "Clinic hours", type: "list",
    of: [{ name: "line", label: "Line", type: "text" }],
  },
  { name: "hours_note", label: "Hours note", type: "text" },
];

export const BLOCK_SCHEMAS: BlockSchema[] = [
  {
    key: "settings",
    label: "Site Settings (shared)",
    group: "Global",
    global: true,
    fields: [
      { name: "site_name", label: "Site name", type: "text" },
      { name: "topbar_left_1", label: "Top bar item 1", type: "text" },
      { name: "topbar_left_2", label: "Top bar item 2", type: "text" },
      { name: "footer_tagline", label: "Footer tagline", type: "textarea" },
      {
        name: "footer_services", label: "Footer — Services column links", type: "list",
        of: [
          { name: "label", label: "Label", type: "text" },
          { name: "href", label: "Link", type: "text" },
        ],
      },
      {
        name: "footer_quicklinks", label: "Footer — Quick Links column", type: "list",
        of: [
          { name: "label", label: "Label", type: "text" },
          { name: "href", label: "Link", type: "text" },
        ],
      },
      { name: "copyright", label: "Copyright line", type: "text" },
    ],
  },
  {
    key: "home_hero",
    label: "Home — Hero",
    group: "Home",
    fields: [
      { name: "heading", label: "Heading", type: "text" },
      { name: "subheading", label: "Subheading", type: "text" },
      { name: "cta_label", label: "Button label", type: "text" },
      { name: "cta_href", label: "Button link", type: "text" },
      { name: "background", label: "Background image", type: "image" },
    ],
  },
  {
    key: "home_quick_cards",
    label: "Home — Quick action cards",
    group: "Home",
    fields: [
      {
        name: "cards", label: "Cards", type: "list",
        of: [
          { name: "title", label: "Title", type: "text" },
          { name: "href", label: "Link", type: "text" },
          { name: "icon", label: "Icon image", type: "image" },
        ],
      },
    ],
  },
  {
    key: "home_services",
    label: "Home — Services section",
    group: "Home",
    fields: [
      { name: "heading", label: "Heading", type: "text" },
      { name: "body", label: "Intro text", type: "textarea" },
      { name: "cta_label", label: "Button label", type: "text" },
      { name: "cta_href", label: "Button link", type: "text" },
    ],
  },
  {
    key: "home_why",
    label: "Home — Why Choose Us",
    group: "Home",
    fields: [
      { name: "heading", label: "Heading", type: "text" },
      { name: "subheading", label: "Subheading", type: "textarea" },
      { name: "image", label: "Side image", type: "image" },
      {
        name: "items", label: "Reasons", type: "list",
        of: [
          { name: "title", label: "Title", type: "text" },
          { name: "text", label: "Text", type: "textarea" },
        ],
      },
    ],
  },
  {
    key: "home_team",
    label: "Home — Team section",
    group: "Home",
    fields: [
      { name: "heading", label: "Heading", type: "text" },
      { name: "subheading", label: "Subheading", type: "text" },
    ],
  },
  {
    key: "home_chatbot",
    label: "Home — Help / Contact CTA",
    group: "Home",
    fields: [
      { name: "help_heading", label: "Heading", type: "text" },
      { name: "help_body", label: "Text", type: "textarea" },
    ],
  },
  {
    key: "home_business",
    label: "Home — Business enquiries",
    group: "Home",
    fields: [
      { name: "heading", label: "Heading", type: "text" },
      { name: "body", label: "Text", type: "textarea" },
      { name: "email", label: "Email (used for the button link, not shown)", type: "text" },
      { name: "cta_label", label: "Button label", type: "text" },
    ],
  },
  {
    key: "home_resources",
    label: "Home — Additional resources",
    group: "Home",
    fields: [
      { name: "heading", label: "Heading", type: "text" },
      { name: "subheading", label: "Subheading", type: "text" },
      { name: "image", label: "Side image", type: "image" },
      {
        name: "items", label: "Resources", type: "list",
        of: [
          { name: "title", label: "Title", type: "text" },
          { name: "text", label: "Text", type: "textarea" },
          { name: "href", label: "Link (optional)", type: "text" },
        ],
      },
    ],
  },
  {
    key: "about_page",
    label: "About Us page",
    group: "About",
    fields: [
      { name: "hero_heading", label: "Hero heading", type: "text" },
      { name: "hero_subheading", label: "Hero subheading", type: "text" },
      { name: "hero_badge", label: "Hero badge line", type: "text" },
      { name: "hero_background", label: "Hero background", type: "image" },
      { name: "know_heading", label: "Get To Know Us — heading", type: "text" },
      { name: "know_body", label: "Get To Know Us — text", type: "textarea" },
      {
        name: "know_points", label: "Get To Know Us — bullets", type: "list",
        of: [{ name: "text", label: "Bullet", type: "text" }],
      },
      { name: "mission_heading", label: "Mission — heading", type: "text" },
      {
        name: "mission_items", label: "Mission — bullets", type: "list",
        of: [
          { name: "title", label: "Title", type: "text" },
          { name: "text", label: "Text", type: "textarea" },
        ],
      },
      { name: "mission_image", label: "Mission image", type: "image" },
      { name: "vision_heading", label: "Vision — heading", type: "text" },
      { name: "vision_body", label: "Vision — text", type: "textarea" },
      { name: "goals_heading", label: "Goals — heading", type: "text" },
      {
        name: "goals_items", label: "Goals — bullets", type: "list",
        of: [{ name: "text", label: "Goal", type: "textarea" }],
      },
      { name: "goals_image", label: "Vision/Goals image", type: "image" },
      { name: "testimonials_heading", label: "Testimonials heading", type: "text" },
    ],
  },
  {
    key: "team_page",
    label: "Our Team page",
    group: "Pages",
    fields: [
      { name: "hero_heading", label: "Hero heading", type: "text" },
      { name: "hero_subheading", label: "Hero subheading", type: "text" },
      { name: "hero_background", label: "Hero background", type: "image" },
      { name: "physicians_heading", label: "Physicians heading", type: "text" },
      { name: "assistants_heading", label: "Assistants heading", type: "text" },
      { name: "assistants_subheading", label: "Assistants subheading", type: "text" },
    ],
  },
  {
    key: "services_page",
    label: "Medical Services page",
    group: "Pages",
    fields: [
      { name: "hero_heading", label: "Hero heading", type: "text" },
      { name: "hero_subheading", label: "Hero subheading", type: "text" },
      { name: "hero_background", label: "Hero background", type: "image" },
      { name: "list_heading", label: "List heading", type: "text" },
    ],
  },
  {
    key: "uninsured_page",
    label: "Uninsured Services page",
    group: "Pages",
    fields: [
      { name: "hero_heading", label: "Hero heading", type: "text" },
      { name: "hero_subheading", label: "Hero subheading", type: "text" },
      { name: "hero_background", label: "Hero background", type: "image" },
      { name: "intro_heading", label: "Intro heading", type: "text" },
      { name: "intro_body", label: "Intro text", type: "textarea" },
      { name: "note", label: "Note under tables", type: "textarea" },
    ],
  },
  {
    key: "faq_page",
    label: "FAQ page",
    group: "Pages",
    fields: [
      { name: "hero_heading", label: "Hero heading", type: "text" },
      { name: "hero_subheading", label: "Hero subheading", type: "textarea" },
      { name: "hero_background", label: "Hero background", type: "image" },
      { name: "list_heading", label: "List heading", type: "text" },
      { name: "list_subheading", label: "List subheading", type: "textarea" },
    ],
  },
  {
    key: "contact_page",
    label: "Contact Us page",
    group: "Pages",
    fields: [
      { name: "hero_heading", label: "Hero heading", type: "text" },
      { name: "hero_subheading", label: "Hero subheading", type: "text" },
      { name: "hero_background", label: "Hero background", type: "image" },
      {
        name: "cards", label: "Info cards", type: "list",
        of: [
          { name: "title", label: "Title", type: "text" },
          { name: "text", label: "Text", type: "textarea" },
        ],
      },
      { name: "form_heading", label: "Form heading", type: "text" },
      { name: "form_body", label: "Form intro", type: "textarea" },
      { name: "reviews_heading", label: "Google review card heading", type: "text" },
      { name: "reviews_body", label: "Google review card intro", type: "textarea" },
    ],
  },
  {
    key: "gallery_page",
    label: "View Clinic (Gallery) page",
    group: "Pages",
    fields: [
      { name: "hero_heading", label: "Hero heading", type: "text" },
      { name: "hero_background", label: "Hero background", type: "image" },
      { name: "list_heading", label: "Gallery heading", type: "text" },
    ],
  },
];

// ---- Collections (CRUD lists) ----

export type ColumnType = "text" | "textarea" | "image" | "number" | "boolean" | "select";

export interface Column {
  name: string;
  label: string;
  type: ColumnType;
  options?: string[]; // for select
  inTable?: boolean; // show in the list view
}

export interface CollectionSchema {
  table: string;
  label: string;
  singular: string;
  orderBy: string;
  columns: Column[];
}

export const COLLECTION_SCHEMAS: CollectionSchema[] = [
  {
    table: "services",
    label: "Medical Services",
    singular: "service",
    orderBy: "sort",
    columns: [
      { name: "title", label: "Title", type: "text", inTable: true },
      { name: "description", label: "Description", type: "textarea", inTable: true },
      { name: "image_url", label: "Image", type: "image" },
      { name: "featured", label: "Show on home page", type: "boolean", inTable: true },
      { name: "sort", label: "Order", type: "number", inTable: true },
    ],
  },
  {
    table: "team_members",
    label: "Team Members",
    singular: "team member",
    orderBy: "sort",
    columns: [
      { name: "name", label: "Name", type: "text", inTable: true },
      { name: "credentials", label: "Credentials", type: "text", inTable: true },
      {
        name: "role", label: "Role", type: "select", inTable: true,
        options: ["physician", "staff", "assistant"],
      },
      { name: "bio", label: "Bio", type: "textarea" },
      { name: "photo_url", label: "Photo", type: "image" },
      { name: "featured", label: "Show on home page", type: "boolean", inTable: true },
      { name: "sort", label: "Order", type: "number", inTable: true },
    ],
  },
  {
    table: "faqs",
    label: "FAQs",
    singular: "FAQ",
    orderBy: "sort",
    columns: [
      { name: "question", label: "Question", type: "text", inTable: true },
      { name: "answer", label: "Answer", type: "textarea" },
      { name: "sort", label: "Order", type: "number", inTable: true },
    ],
  },
  {
    table: "fee_sections",
    label: "Fee Tables",
    singular: "fee table",
    orderBy: "sort",
    columns: [
      { name: "title", label: "Table title", type: "text", inTable: true },
      { name: "sort", label: "Order", type: "number", inTable: true },
    ],
  },
  {
    table: "fee_items",
    label: "Fee Items",
    singular: "fee item",
    orderBy: "sort",
    columns: [
      {
        name: "section_id", label: "Fee table", type: "select", inTable: true,
        options: [], // filled at runtime from fee_sections
      },
      { name: "service", label: "Service", type: "textarea", inTable: true },
      { name: "cost", label: "Cost", type: "text", inTable: true },
      { name: "sort", label: "Order", type: "number", inTable: true },
    ],
  },
  {
    table: "gallery_images",
    label: "Gallery Images",
    singular: "image",
    orderBy: "sort",
    columns: [
      { name: "image_url", label: "Image", type: "image", inTable: true },
      { name: "caption", label: "Caption", type: "text", inTable: true },
      { name: "sort", label: "Order", type: "number", inTable: true },
    ],
  },
  {
    table: "testimonials",
    label: "Testimonials",
    singular: "testimonial",
    orderBy: "sort",
    columns: [
      { name: "name", label: "Name", type: "text", inTable: true },
      { name: "quote", label: "Quote", type: "textarea", inTable: true },
      { name: "sort", label: "Order", type: "number", inTable: true },
    ],
  },
];

export function getBlockSchema(key: string) {
  return BLOCK_SCHEMAS.find((b) => b.key === key);
}

export function getCollectionSchema(table: string) {
  return COLLECTION_SCHEMAS.find((c) => c.table === table);
}
