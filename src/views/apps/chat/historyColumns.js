export const historyColumns = [
  {
    name: "ID",
    minWidth: "15px",
    selector: "note date",
    sortable: true,
    cell: (row) => row.customer_id
  },
  {
    name: "channel",
    minWidth: "15px",
    selector: "registerer",
    sortable: true,
    cell: (row) => row.channel_name
  },
  {
    name: "Operator",
    minWidth: "20px",
    selector: "registerer",
    sortable: true,
    cell: (row) => row.user_name_surname
  }
]