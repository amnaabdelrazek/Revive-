export enum AddictionDuration
{
    LessThan6Months = 1,
    From6To12Months = 2,
    From1To3Years = 3,
    Over3Years = 4
}

export enum EducationLevel
{
    None = 5,
    Primary = 6,
    Secondary = 7,
    University = 8,
    Postgraduate = 9
}

export enum TreatmentType
{
    Hospital = 10,
    Outpatient = 11,
    Self = 12,
    Religious = 13
}

export enum Substance
{
    Hash = 1,
    Bango = 2,
    Hydra = 3,
    Opium = 4,
    Tramadol = 5,
    Heroin = 6,
    Shabu = 7,
    Cocaine = 8,
    Ecstasy = 9,
    Lsd = 10,
    IceCrystalMeth = 11
}

export enum SubstanceCategory
{
    Depressants = 1,
    Sedatives = 2,
    Stimulants = 3,
    Hallucinogens = 4
}


export enum UserRole
{
    Addict = 0,     // "addict"
    Instructor = 1, // "instructor"
    Admin = 2       // "admin"
}

export enum SessionStatus
{
    Scheduled = 0,  // "scheduled"
    Live = 1,       // "live"
    Finished = 2    // "finished"
}

export enum SessionType
{
    Group = 0,  // "group"
    Paid = 1    // "paid"
}

export enum GroupStatus
{
    Forming = 0, // "forming"
    Active = 1   // "active"
}

export enum GroupType
{
    Mixed = 0 // "mixed"
}

export enum PaymentStatus
{
    Pending = 0, // "pending"
    Paid = 1     // "paid"
}

export enum PaymentGateway
{
    Manual = 0, // "manual"
    Stripe = 1  // "stripe"
}

export enum RecommendationType
{
    Clinic = 0,        // "clinic"
    Hospital = 1,      // "hospital"
    SupportGroup = 2   // "support_group"
}

export enum PreferredLanguage
{
    Arabic = 0,  // "ar"
    English = 1  // "en"
}

export enum NotificationType
{
    Info = 0,      // "info"
    Reminder = 1   // "reminder"
}

export enum NotificationIcon
{
    Bell = 0,      // "bell"
    Calendar = 1,  // "calendar"
    Video = 2,     // "video"
    CreditCard = 3 // "credit-card"
}