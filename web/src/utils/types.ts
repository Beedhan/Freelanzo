export interface AddDialogProps {
  editing: {id:string,open:boolean,name:string,price:number};
  setEditing: React.Dispatch<React.SetStateAction<{id:string,open:boolean,name:string,price:number}>>;
}
export interface StripeDialogProps {
  editing: {id:string,open:boolean,public_key:string,secret_key:string};
  setEditing: React.Dispatch<React.SetStateAction<{id:string,open:boolean,public_key:string,secret_key:string}>>;
}

export type Id = string;
export type TaskSection = {
  id: Id;
  title: string;
};

export type Task = {
  id: Id;
  title:string;
  taskSectionId: Id;
};