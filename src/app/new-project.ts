export class NewProject {
    constructor(
        public project_name:String,
        public note:String,
        public description: String,
    ){}
}

export class newRecord {
    constructor(
        public vehicle_no:String,
        public date_of_journey:Date,
        public day_start_reading: String,
        public day_end_reading: String,
        public locations_visited: String,
        public drivers_mobile_no:String,
        public day_kms: String,
        public maintenance: String,
        public expense_for_maintenance: String,
    ){}
}

export class newVehicle {
    constructor(
        public vehicle_brand:String,
        public vehicle_number:String,
        public fuel_type: String,
        public tc: String,
        public rc: String,
        public puc: String,
        public fc: String,
        public ic: String,
        public invoice: String,
        public driver_name: String,
        public driver_mobile_number: String,
        public initial_reading:String,
    ){}
}
