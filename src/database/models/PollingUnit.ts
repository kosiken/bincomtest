export interface IPollingUnit { 
    uniqueid: number;
    polling_unit_id: number;
    ward_id: number;
    lga_id: number;
    uniquewardid: number;
    polling_unit_number: string;
    polling_unit_name: string;
    polling_unit_description: string;
    lat: string;
    long: string;
    entered_by_user: string;
    date_entered: Date;
    user_ip_address: string;
}