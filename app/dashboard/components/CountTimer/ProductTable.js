import { DataTable } from "@nimbus-ds/data-table";
import { Tag } from "@nimbus-ds/components";
import { CheckCircleIcon, ExclamationTriangleIcon } from "@nimbus-ds/icons";

export default function ProductTable({
  categoryId,
  rows = [],
  checkedRows = [],
  setCheckedRows,
  headerCheckboxStatus = false,
  setHeaderCheckboxStatus,
  headerIndeterminateStatus = false,
  setHeaderIndeterminateStatus,
}) {
  const handleRowClick = (id) => {
    const updatedChecked = checkedRows.includes(id)
      ? checkedRows.filter((rowId) => rowId !== id)
      : [...checkedRows, id];

    setCheckedRows((prev) => ({ ...prev, [categoryId]: updatedChecked }));

    // Actualizamos header checkbox
    const total = rows.length;
    const checked = updatedChecked.length;
    setHeaderCheckboxStatus((prev) => ({
      ...prev,
      [categoryId]: checked === total,
    }));
    setHeaderIndeterminateStatus((prev) => ({
      ...prev,
      [categoryId]: checked > 0 && checked < total,
    }));
  };

  const handleHeaderCheckboxClick = () => {
    if (headerCheckboxStatus) {
      setCheckedRows((prev) => ({ ...prev, [categoryId]: [] }));
    } else {
      setCheckedRows((prev) => ({
        ...prev,
        [categoryId]: rows.map((r) => r.id),
      }));
    }
    setHeaderCheckboxStatus((prev) => ({
      ...prev,
      [categoryId]: !headerCheckboxStatus,
    }));
    setHeaderIndeterminateStatus((prev) => ({
      ...prev,
      [categoryId]: false,
    }));
  };

  const tableHeader = (
    <DataTable.Header
      checkbox={{
        name: `check-all-${categoryId}`,
        checked: headerCheckboxStatus,
        onChange: handleHeaderCheckboxClick,
        indeterminate: headerIndeterminateStatus,
      }}
    >
      <DataTable.Cell width="auto">Producto</DataTable.Cell>
      <DataTable.Cell width="100px">Stock</DataTable.Cell>
      <DataTable.Cell width="120px">Estado</DataTable.Cell>
    </DataTable.Header>
  );

  return (
    <DataTable header={tableHeader}>
      {rows.map((row) => (
        <DataTable.Row
          key={row.id}
          checkbox={{
            name: `check-${row.id}`,
            checked: checkedRows.includes(row.id),
            onChange: () => handleRowClick(row.id),
          }}
        >
          <DataTable.Cell>{row.name}</DataTable.Cell>
          <DataTable.Cell>{row.stock}</DataTable.Cell>
          <DataTable.Cell>
            <Tag appearance={row.status ? "success" : "warning"}>
              {row.status ? <CheckCircleIcon /> : <ExclamationTriangleIcon />}
              {row.status ? "Activo" : "Inactivo"}
            </Tag>
          </DataTable.Cell>
        </DataTable.Row>
      ))}
    </DataTable>
  );
}
