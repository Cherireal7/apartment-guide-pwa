export type Guide = {
    apartmentId: string;
    name: string;
    emergency: {
        contacts: Array<{ label: string; type: "phone" | "whatsapp"; value: string }>;
        items: Array<{
            id: string;
            type: "water" | "electric" | "fire" | "other";
            title: string;
            locationText: string;
            steps: string[];
            imageUrl?: string;
        }>;
    };
    items: Array<{
        id: string;
        category: "tools" | "safety" | "utilities" | "appliances" | "other";
        title: string;
        locationText: string;
        imageUrl?: string;
        notes?: string;
        steps?: string[];
    }>;
    wifi?: { name: string; password: string };
    houseRules?: string[];
    checkoutChecklist?: string[];
};
