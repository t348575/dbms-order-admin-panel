export type EmployeeModel = {
    emp_id: string,
    emp_type: string,
    emp_name: string,
    emp_job_title: string,
    emp_dob: string,
    emp_hours: number,
    emp_phone: string,
    emp_email: string,
    emp_payment: {
        name: string,
        card: string,
        cvc: string,
        exp: string
    }
};
