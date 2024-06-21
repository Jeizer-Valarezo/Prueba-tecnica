import React from "react";
import { Typography, Container } from "@mui/material";

const DrugDetail = ({ drug }) => {
  console.log(drug);

  const {
    openfda = {},
    active_ingredient = [],
    inactive_ingredient = [],
    purpose = [],
    warnings = [],
    dosage_and_administration = [],
    stop_use = [],
    keep_out_of_reach_of_children = [],
    pregnancy_or_breast_feeding = [],
    storage_and_handling = [],
    do_not_use = [],
  } = drug || {};

  const {
    brand_name = [],
    generic_name = [],
    manufacturer_name = [],
  } = openfda;

  return (
    <Container>
      <Typography variant="h4">{generic_name[0] || "No generic name available"}</Typography>
      <Typography variant="subtitle1">{brand_name[0] || "No brand name available"}</Typography>
      <Typography variant="body2">
        <strong>Active Ingredient:</strong> {active_ingredient[0] || "No active ingredient available"}
      </Typography>
      <Typography variant="body2">
        <strong>Inactive Ingredient:</strong> {inactive_ingredient.join(', ') || "No inactive ingredients available"}
      </Typography>
      <Typography variant="body2">
        <strong>Purpose:</strong> {purpose[0] || "No purpose available"}
      </Typography>
      <Typography variant="body2">
        <strong>Dosage and Administration:</strong> {dosage_and_administration[0] || "No dosage and administration instructions available"}
      </Typography>
      <Typography variant="body2">
        <strong>Warnings:</strong> {warnings[0] || "No warnings available"}
      </Typography>
      <Typography variant="body2">
        <strong>Stop Use:</strong> {stop_use[0] || "No stop use information available"}
      </Typography>
      <Typography variant="body2">
        <strong>Keep Out of Reach of Children:</strong> {keep_out_of_reach_of_children[0] || "No keep out of reach of children information available"}
      </Typography>
      <Typography variant="body2">
        <strong>Pregnancy or Breast Feeding:</strong> {pregnancy_or_breast_feeding[0] || "No pregnancy or breast feeding information available"}
      </Typography>
      <Typography variant="body2">
        <strong>Storage and Handling:</strong> {storage_and_handling[0] || "No storage and handling information available"}
      </Typography>
      <Typography variant="body2">
        <strong>Do Not Use:</strong> {do_not_use[0] || "No do not use information available"}
      </Typography>
      <Typography variant="body2">
        <strong>Manufacturer:</strong> {manufacturer_name.join(", ") || "No manufacturer information available"}
      </Typography>
    </Container>
  );
};

export default DrugDetail;
