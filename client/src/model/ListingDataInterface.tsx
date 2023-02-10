export interface ListingDataInterface {
    _id?: string | null;
    userType?: string | null;
    email?: string | null;
    amenities?: (string)[] | null;
    reviews?: (ReviewsEntity | null)[] | null;
    __v?: number | null;
    description: string;
    name: string;
    images?: Images | null;
    host?: Host | null;
    address?: Address | null;
    availability?: Availability | null;
    review_scores?: ReviewScores | null;
    listing_url?: string | null;
    summary?: string | null;
    space?: string | null;
    neighborhood_overview?: string | null;
    notes?: string | null;
    transit?: string | null;
    access?: string | null;
    interaction?: string | null;
    house_rules?: string | null;
    property_type?: string | null;
    room_type?: string | null;
    bed_type?: string | null;
    minimum_nights?: string | null;
    maximum_nights?: string | null;
    cancellation_policy?: string | null;
    last_scraped?: string | null;
    calendar_last_scraped?: string | null;
    first_review?: string | null;
    last_review?: string | null;
    accommodates?: number | null;
    bedrooms?: number | null;
    beds?: number | null;
    number_of_reviews?: number | null;
    bathrooms?: number | null;
    price?: number | null;
    security_deposit?: SecurityDepositOrCleaningFee | null;
    cleaning_fee?: SecurityDepositOrCleaningFee1 | null;
    extra_people?: number | null;
    guests_included?: number | null;
  }
  export interface ReviewsEntity {
    _id: string;
    date: string;
    listing_id: string;
    reviewer_id: string;
    reviewer_name: string;
    comments: string;
  }
  export interface Images {
    thumbnail_url: string;
    medium_url: string;
    picture_url: string;
    xl_picture_url: string;
  }
  export interface Host {
    host_id: string;
    host_url: string;
    host_name: string;
    host_location: string;
    host_about: string;
    host_response_time: string;
    host_thumbnail_url: string;
    host_picture_url: string;
    host_neighbourhood: string;
    host_response_rate: number;
    host_is_superhost: boolean;
    host_has_profile_pic: boolean;
    host_identity_verified: boolean;
    host_listings_count: number;
    host_total_listings_count: number;
    host_verifications?: (string)[] | null;
  }
  export interface Address {
    street: string;
    suburb: string;
    government_area: string;
    market: string;
    country: string;
    country_code: string;
  }
  export interface Availability {
    availability_30: number;
    availability_60: number;
    availability_90: number;
    availability_365: number;
  }
  export interface ReviewScores {
    review_scores_accuracy: number;
    review_scores_cleanliness: number;
    review_scores_checkin: number;
    review_scores_communication: number;
    review_scores_location: number;
    review_scores_value: number;
    review_scores_rating: number;
  }
  export interface SecurityDepositOrCleaningFee {
    $numberDecimal: string;
  }
  export interface SecurityDepositOrCleaningFee1 {
    $numberDecimal: string;
  }
  