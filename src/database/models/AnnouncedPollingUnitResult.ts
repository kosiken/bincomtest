export interface IAnnouncedPollingUnitResult {
    result_id: number;
    polling_unit_uniqueid: string;
    party_abbreviation: string;
    party_score: number;
    entered_by_user: string;
    date_entered: Date;
    user_ip_address: string;   
}