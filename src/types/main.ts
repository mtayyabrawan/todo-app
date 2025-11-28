type Status = "pending" | "done" | "overdue";

export type Task = {
    id: string;
    title: string;
    description: string;
    status: Status;
    category: string;
    dueDate: string;
    createdAt: string;
};

export type CreateTask = Omit<Task, "id" | "createdAt" | "status"> &
    Partial<Pick<Task, "id" | "status" | "createdAt">>;

export type ContactData = {
    firstname: string;
    lastname: string;
    email: string;
    query: "general_enquiry" | "support_request";
    message: string;
    consent: "on";
};
