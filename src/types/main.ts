export type Task = {
    id: string;
    title: string;
    description: string;
    status: "pending" | "done" | "overdue";
    category: string;
    dueDate: string;
    createdAt: string;
};
