export type StatusType = "success" | "info" | "error";

export type StatusState = {
  open: boolean;
  text: string;
  type: StatusType;
  duration: number;
};
