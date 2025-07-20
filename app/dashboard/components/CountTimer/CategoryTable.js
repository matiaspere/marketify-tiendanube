"use client";

import { Box, Card, Text, IconButton } from "@nimbus-ds/components";
import { ChevronDownIcon, ChevronUpIcon } from "@nimbus-ds/icons";
import ProductTable from "./ProductTable";

export default function CategoryTable({
  categories,
  openCategories,
  setOpenCategories,
  rows,
  setRows,
  checkedRows,
  setCheckedRows,
  headerCheckboxStatus,
  setHeaderCheckboxStatus,
  headerIndeterminateStatus,
  setHeaderIndeterminateStatus,
}) {
  const toggleCategory = (categoryId) => {
    setOpenCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  return (
    <Box display="flex" flexDirection="column" gap="4">
      {categories.map((category) => (
        <Card key={category.id} p="4" bg="neutral-surface">
          {/* HEADER */}
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            onClick={() => toggleCategory(category.id)}
            style={{ cursor: "pointer" }}
          >
            <Text fontSize="base" color="neutral-textHigh" fontWeight="bold">
              {category.name}
            </Text>
            <IconButton
              source={
                openCategories[category.id] ? (
                  <ChevronUpIcon />
                ) : (
                  <ChevronDownIcon />
                )
              }
              size="1.5rem"
            />
          </Box>

          {/* PRODUCTS TABLE */}
          {openCategories[category.id] && (
            <Box mt="4">
              <ProductTable
                categoryId={category.id}
                rows={rows[category.id]}
                setRows={setRows}
                checkedRows={checkedRows[category.id]}
                setCheckedRows={setCheckedRows}
                headerCheckboxStatus={headerCheckboxStatus[category.id]}
                setHeaderCheckboxStatus={setHeaderCheckboxStatus}
                headerIndeterminateStatus={
                  headerIndeterminateStatus[category.id]
                }
                setHeaderIndeterminateStatus={setHeaderIndeterminateStatus}
              />
            </Box>
          )}
        </Card>
      ))}
    </Box>
  );
}
