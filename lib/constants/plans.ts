export interface Plan {
    id: string;
    name: string;
    label: {
        bn: string;
        en: string;
    };
    price: {
        bn: string;
        en: string;
    };
    period?: {
        bn: string;
        en: string;
    };
    features: {
        bn: string[];
        en: string[];
    };
    popular?: boolean;
}

export const PLANS: Plan[] = [
    {
        id: 'free',
        name: 'Free',
        label: {
            bn: 'ফ্রি',
            en: 'Free'
        },
        price: {
            bn: '৳০',
            en: '৳0'
        },
        features: {
            bn: ['প্রতিদিন ৩টি প্রশ্ন', 'বেসিক ব্যাখ্যা', 'সব বিষয় এক্সেস', 'মোবাইল সাপোর্ট'],
            en: ['3 questions per day', 'Basic explanations', 'Access to all subjects', 'Mobile support']
        }
    },
    {
        id: 'pro',
        name: 'Pro',
        label: {
            bn: 'প্রো',
            en: 'Pro'
        },
        price: {
            bn: '৳২৯৯',
            en: '৳299'
        },
        period: {
            bn: '/মাস',
            en: '/mo'
        },
        popular: true,
        features: {
            bn: ['আনলিমিটেড প্রশ্ন', 'ধাপে ধাপে বিস্তারিত ব্যাখ্যা', 'ফটো আপলোড (OCR)', '১০০% নয়েজ ফ্রি এক্সপেরিয়েন্স', 'প্রায়োরিটি সাপোর্ট'],
            en: ['Unlimited questions', 'Step-by-step detailed explanations', 'Photo upload (OCR)', '100% noise-free experience', 'Priority support']
        }
    },
    {
        id: 'student_plus',
        name: 'Student Plus',
        label: {
            bn: 'স্টুডেন্ট প্লাস',
            en: 'Student Plus'
        },
        price: {
            bn: '৳৭৯৯',
            en: '৳799'
        },
        period: {
            bn: '/বছর',
            en: '/yr'
        },
        features: {
            bn: ['সব প্রো ফিচার', 'এআই ভিডিও টিউটোরিয়াল', 'অফলাইন পড়ার সুবিধা', 'এক্সাম প্রিপারেশন নোট'],
            en: ['All Pro features', 'AI video tutorials', 'Offline study mode', 'Exam preparation notes']
        }
    }
];
