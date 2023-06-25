// Import
import { config } from "@/config/config";

// POST Call definition
export async function post(endpoint, body = {}, access = null) {
  // Build header information
  var header = {
    Accept: "application/json",
    "Content-Type": "application/json",
  };

  // Add access token if one is provided
  if (access) header["Authorization"] = `Bearer ${access}`;

  // POST call given url and body info
  var res = await fetch(`${config.apiBase}/${endpoint}`, {
    method: "POST",
    headers: header,
    body: JSON.stringify(body)
  });

  // Return the call response
  return await res.json();
}

// GET Call definition
export async function get(endpoint, access = null) {
  // Build header information
  var header = {
    "Accept": "application/json",
    "Content-Type": "application/json",
  };

  // Add access token if one is provided
  if (access) header["Authorization"] = `Bearer ${access}`;

  // POST call given url and body info
  var res = await fetch(`${config.apiBase}/${endpoint}`, {
    method: "GET",
    headers: header
  });

  // Return the call response
  return await res.json();
}