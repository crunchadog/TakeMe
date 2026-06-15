export type TripStatus = 'ACTIVE' | 'COMPLETED' | 'CANCELLED'

export interface TripMember {
    user: {
        id: string;
        name: string;
    }
}

export interface Trip {
    id: string;
    startLat: number;
    startLng: number;
    startAddress: string;
    departureTime: string;
    seatsTotal: number;
    status: TripStatus;
    driver: {
        id: string;
        name: string;
    },
    office: {
        id: string;
        name: string;
        city: string;
        address: string;
        lat: number;
        lng: number;
    },
    members: TripMember[],
}

export interface CreateTripArgs {
    officeId: string;
    startLat: number;
    startLng: number;
    startAddress: string;
    departureTime: string;
    seatsTotal: number;
}