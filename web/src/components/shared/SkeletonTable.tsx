import React from "react";
import { Skeleton } from "../ui/skeleton";
import { TableRow, TableCell } from "../ui/table";

const SkeletonTable = ({ rows }: { rows: number }) => {
  return (
    <>
      {new Array(rows).fill(0).map((_, i) => (
        <TableRow key={i}>
          <TableCell>
            <Skeleton className="h-10 w-full rounded" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-10 w-full rounded" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default SkeletonTable;
