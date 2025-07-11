declare global {
  /* eslint-disable */
  /**
   * Base interface for common properties shared across many objects in the Carolina system.
   * Contains core attributes like template type, metadata, content IDs, and execution details.
   */
  interface CarolinaBaseObject {
    /** The type of template being used */
    templateType: string;
    /** Optional metadata key-value pairs associated with the object */
    metadata?: Record<string, unknown>;
    /** Unique identifier for the content */
    contentId: string;
    /** Optional identifier for the parent container */
    containerContentId?: string;
    /** Additional attributes stored as key-value pairs */
    attributes: Record<string, unknown>;
    /** Timestamp when execution started */
    executionStartTime: number;
    /** Flag indicating if the content is in preview mode */
    previewMode: boolean;
  }

  /**
   * Represents a content folder structure in the Carolina system.
   * Contains folder path information and optional child rules for content organization.
   */
  interface ContentFolder extends CarolinaBaseObject {
    /** Path to the content folder */
    folderPath: string;
    /** Optional array of content rules that apply to this folder */
    childRules?: ContentRule[];
    /** Type identifier for content rule folders */
    "@type": "ContentRuleFolder";
  }

  /**
   * Container for search results in the Carolina system.
   * Extends the content rule zone item to hold an array of search result items.
   */
  interface ResultsContainer extends ContentRuleZoneItem {
    /** Type identifier for results containers */
    "@type": "ResultsContainer";
    /** Array of search result items */
    results: unknown[];
  }

  /**
   * Defines content rules for page organization and structure.
   * Contains rule identification and associated content zone items.
   */
  interface ContentRule extends CarolinaBaseObject {
    /** Title of the page associated with this rule */
    pageTitle: string;
    /** Type identifier for content rules */
    "@type": "ContentRule";
    /** Unique identifier for the rule */
    ruleId: string;
    /** Array of content rule zone items */
    ContentRuleZone: ContentRuleZoneItem[];
  }

  /**
   * Represents items within a content rule zone.
   * Can contain various content types including folders, main content, and navigation menus.
   */
  interface ContentRuleZoneItem extends CarolinaBaseObject {
    /** Type identifier for the zone item */
    "@type": string;
    /** Optional content sections including folders and main content */
    contents?: {
      /** Array of content folders within this zone */
      ContentFolderZone?: ContentFolder[];
      /** Array of main content items */
      MainContent?: MainContentItem[];
    };
    /** Optional submenu items for navigation */
    subMenus?: MenuItem[];
    /** Optional top-level category menu items */
    topCategories?: MenuItem[];
    /** Optional most popular menu items */
    mostPopular?: MenuItem[];
  }

  /**
   * Defines main content items within the content structure.
   * Can contain nested content folders and other content-specific data.
   */
  interface MainContentItem extends CarolinaBaseObject {
    /** Type identifier for the main content item */
    "@type": string;
    /** Optional content sections */
    contents?: {
      /** Array of content folders within this main content item */
      ContentFolderZone?: ContentFolder[];
    };
  }

  /**
   * Represents a navigation menu item in the Carolina system.
   * Contains link information, display properties, and optional category identification.
   */
  interface MenuItem {
    /** URL for the menu item */
    link: string;
    /** Descriptive text for the menu item */
    description: string;
    /** Optional product category identifier */
    productCategoryId?: string;
    /** Name shown in the UI */
    displayName: string;
    /** URL for the menu item's associated image */
    imageUrl: string;
  }

  /**
   * Represents a single facet item used for filtering and navigation.
   * Contains facet metadata and URL information for filtering purposes.
   */
  interface FacetItem {
    /** Display name of the facet */
    name: string;
    /** Number of items with this facet value */
    count: number;
    /** Name of the field this facet represents */
    fieldName: string;
    /** URL-friendly name for the facet */
    facetUrlName: string | number;
    /** Value of the facet field */
    fieldValue: string;
    /** Complete URL for filtering by this facet */
    url: string;
  }

  /**
   * Container for managing faceted navigation and filtering.
   * Includes facet collections, sorting information, and selected filter crumbs.
   */
  interface FacetsContainer extends CarolinaBaseObject {
    /** Collection of facets grouped by field name */
    facets: Array<Record<string, FacetItem[]>>;
    /** Mapping of facet names to their sort types */
    facetSortMap: Record<string, string>;
    /** Mapping of facet names to their sort order arrays */
    facetSortOrderMap: Record<string, string[]>;
    /** Array of currently selected facet filters */
    selectedCrumb: Array<{
      /** Name of the faceted field */
      fieldName: string;
      /** Display label for the filter */
      label: string;
      /** Navigation state for the filter */
      navigationState: string;
      /** Value of the faceted field */
      fieldValue: string;
      /** Name shown in the UI */
      displayName: string;
    }>;
  }

  /**
   * Represents a single search result item with product details.
   * Contains product information including images, descriptions, and pricing.
   */
  interface CarolinaSearchResult extends Record<string, unknown> {
    /** URL of the product thumbnail image */
    "product.thumbnailImg": string;
    /** Name of the product */
    "product.productName": string;
    /** Unique identifier for the product */
    "product.productId": string;
    /** Brief description of the product */
    "product.shortDescription": string;
    /** Price of the item */
    itemPrice: string;
    /** SEO-friendly name for the product */
    "product.seoName": string;
    /** URL to the product page */
    productUrl: string;
    /** Display name of the product */
    productName: string;
    /** Indicates if quantity-based discounts are available */
    qtyDiscountAvailable: boolean;
    /** Sequence number for product ordering */
    productSquence: number;
  }

  /**
   * Main response structure for search operations.
   * Contains search results, page information, and associated content data.
   */
  interface CarolinaSearchResponse extends CarolinaBaseObject {
    /** Search recommendations page object */
    ssRecsInfoPageObj: {
      /** Page information */
      page: {
        /** Type of page */
        type: string;
        /** Search query string */
        searchString: string;
      };
    };
    /** Type identifier for the response */
    "@type": string;
    /** Title of the page */
    pageTitle: string;
    /** Setting for image loading behavior */
    enableLoadImageAsLink: string;
    /** HTTP response status code */
    responseStatusCode: number;
    /** Content sections */
    contents: {
      /** Array of content folders */
      ContentFolderZone: ContentFolder[];
    };
    /** Data layer object for analytics */
    dataLayer_obj3: Record<string, unknown>;
    /** List of image URLs used on the page */
    pageImagesList: string[];
  }

  /**
   * Parameters used for constructing search queries.
   * Defines the structure for search requests to the Carolina Biological Supply Company website.
   */
  interface CarolinaSearchParams {
    /** Active tab for the search */
    tab: string;
    /** Product type filter */
    "product.type": string;
    /** Product types filter */
    "product.productTypes": string;
    /** Fields to use for faceted search */
    facetFields: string;
    /** Response format */
    format: string;
    /** Whether this is an AJAX request */
    ajax: boolean;
    /** Number of results to return per page */
    viewSize: number;
    /** Search query string */
    q: string;
    /** Index signature for additional properties */
    [key: string]: string | number | boolean | undefined;
  }

  /**
   * Response structure for ATG (Art Technology Group) product requests.
   * Contains detailed product information including descriptions, display data, and metadata.
   */
  interface ATGResponse {
    /** Status of the ATG request result */
    result: string;
    /** Container for the main response data */
    response: {
      /** Schema data for breadcrumb navigation including JSON structure and data layer information */
      breadCrumbSchemaJson: {
        /** JSON string containing the structured breadcrumb schema data */
        breadCrumbSchemaJson: string;
        /** Analytics data layer object specific to breadcrumb navigation */
        dataLayer_obj: Record<string, string>;
      };
      /** Standard result object containing core product information */
      standardResult: {
        /** Name of the product */
        productName: string;
        /** Unique identifier for the product */
        productId: string;
        /** Order-related data for the product display page */
        pdpOrderResult: Record<string, unknown>;
        /** Specifications for the product */
        tabsResult: {
          /** List of specifications */
          pdpspecifications: {
            /** List of specification items */
            specificationList: SpecificationItem[];
          };
        };
      };
      /** Detailed description of the product */
      longDescription: string;
      /** Product data in string format */
      product: string;
      /** Analytics and tracking data container */
      dataLayer: {
        /** Detailed product information for analytics */
        productDetail: {
          /** URL of the product's primary image */
          productImageUrl: string;
          /** Unique identifier for the product */
          productId: string;
          /** URL to the product's detail page */
          productUrl: string;
          /** Type of page being displayed */
          page_type: string;
          /** Name of the product */
          productName: string;
        };
        /** Array of product price information */
        productPrice: string[];
        /** Container for data layer information */
        dataLayerObject: {
          /** JSON object containing analytics data layer information */
          dataLayerJson: Record<string, string>;
        };
      };
      /** Canonical URL for the product page */
      canonicalUrl: string;
      /** Indicates if the product is a digital learning product */
      isDLProduct: boolean;
      /** Display name shown for the product */
      displayName: string;
      /** Indicates if the product has been discontinued */
      isDiscontinuedItem: boolean;
      /** Indicates if this is a product grouping */
      isproductGrouping: boolean;
      /** Brief description of the product */
      shortDescription: string;
      /** Type or category of the product */
      prodType: string;
      /** Details about product variants within the same family */
      familyVariyantProductDetails: {
        productId: string;
        variantUrl: string;
        schemaJson: {
          schemaJson: {
            offers: {
              image?: string;
              priceCurrency?: string;
              price: number;
              name: string;
              description?: string;
              availability: string;
              sku: string;
              url: string;
              itemCondition?: string;
            }[];
          };
        };
      };
      /** Display name for the product family variant */
      familyVariyantDisplayName: string;
      /** Details about the organization */
      organizationDetails: Record<string, unknown>;
    };
    /** Status of the response */
    status: string;
  }

  /**
   * Represents a specification item in the product details.
   * Contains display name, value, and size information for product specifications.
   */
  interface SpecificationItem {
    /** Display name of the specification */
    specificationDisplayName: string;
    /** Value of the specification */
    stringValue: string;
    /** Size of the specification */
    size: number;
  }

  /**
   * Response structure for product detail requests.
   * Contains main content, response status, and template information.
   */
  interface CarolinaProductResponse {
    /** Content sections */
    contents: {
      /** Main content array */
      MainContent: Array<{
        /** ATG response data */
        atgResponse: {
          response: ATGResponse;
        };
        /** Type of template used */
        templateType: string;
        /** Unique content identifier */
        contentId: string;
        /** Preview mode flag */
        previewMode: boolean;
      }>;
    };
    /** HTTP response status code */
    responseStatusCode: number;
    /** Type of template used */
    templateType: string;
    /** Unique content identifier */
    contentId: string;
    /** Preview mode flag */
    previewMode: boolean;
  }
}

// This export is needed to make the file a module
export {};

/* eslint-enable */
