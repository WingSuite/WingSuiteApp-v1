// Function to insert an add unit object at the end of every children attribute
export function processUnits(obj) {
  // If children attribute exists and it's an array
  if (Array.isArray(obj.children)) {
    obj.children.push({
      name: "Add Unit",
      attributes: { parent_id: obj._id, parent_name: obj.name },
    });

    // Recursively call this function for each child object
    obj.children.forEach((childObj) => {
      processUnits(childObj);
    });
  }
}
