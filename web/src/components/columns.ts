import type { ColumnDef } from "@tanstack/vue-table";
import type { IService } from "@/models/service";
import { h } from "vue";
import { Button } from "@/components/ui/button";
import { ExternalLink, Loader2 } from "lucide-vue-next";
import { formatDateTime } from "@/lib/datetime";

export const columns = (
  onView: (service: IService) => void,
  loadingServiceId: string | null,
): ColumnDef<IService>[] => [
  {
    accessorKey: "title",
    header: "Titel",
    cell: ({ row }) => {
      return h("div", { class: "font-medium" }, row.getValue("title"));
    },
  },
  {
    accessorKey: "createdAt",
    header: "Datum",
    cell: ({ row }) => {
      const timestamp = row.getValue("createdAt") as any;
      return h(
        "div",
        { class: "text-sm text-neutral-600" },
        formatDateTime(timestamp.toDate()),
      );
    },
  },
  {
    accessorKey: "pastor",
    header: "Voorganger",
    cell: ({ row }) => {
      const pastor = row.getValue("pastor") as string | undefined;
      return h("div", { class: "text-sm text-neutral-600" }, pastor || "-");
    },
  },
  {
    id: "actions",
    header: "Acties",
    cell: ({ row }) => {
      const service = row.original;
      const isLoading = loadingServiceId === service.id;

      return h("div", { class: "flex gap-2" }, [
        h(
          Button,
          {
            class: "cursor-pointer",
            variant: "outline",
            size: "sm",
            disabled: isLoading,
            onClick: () => onView(service),
          },
          () => [
            isLoading
              ? h(Loader2, { class: "w-4 h-4 mr-2 animate-spin" })
              : h(ExternalLink, { class: "w-4 h-4 mr-2" }),
            "Openen",
          ],
        ),
      ]);
    },
  },
];
