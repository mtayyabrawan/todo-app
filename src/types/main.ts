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
