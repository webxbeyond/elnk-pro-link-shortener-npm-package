import { ElnkOptions, ElnkResponse } from "./type";

// --------------------------------------------------------
// Common variables
const apiBaseUrl = "https://elnk.pro/api";
const endPoints = {
  links: "/links",
  domains: "/domains/",
};

// ----------------- createLinkIfNotExist ------------------
export async function createLinkIfNotExist({
  longUrl,
  shortUrl = "",
  apiKey,
  domainId = 0,
}: ElnkOptions): Promise<ElnkResponse> {
  try {
    if (!apiKey || !longUrl) {
      throw new Error("API key or long URL is missing.");
    }

    const url = new URL(`${apiBaseUrl}${endPoints.links}`);

    // Step 1: Check if the link already exists
    const isExistResponse = await fetch(url.toString(), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!isExistResponse.ok) {
      throw new Error(`Failed to check existing shortlink. Status: ${isExistResponse.status}`);
    }

    const existingData = await isExistResponse.json();

    // Step 2: Check if the longUrl already exists in the response data
    const findExistingUrl = existingData.data?.find(
      (entry: { location_url: string | null }) => entry.location_url === longUrl
    );

    if (findExistingUrl) {
      return { success: true, message: "Already exists", data: findExistingUrl };
    }

    // Step 3: Prepare FormData for multipart/form-data request
    const formData = new FormData();
    formData.append("location_url", longUrl);
    if (domainId) {
      formData.append("domain_id", String(domainId));
    }
    if (shortUrl) {
        formData.append("url", shortUrl);
      }

    // Step 4: Create a new shortlink
    const createResponse = await fetch(url.toString(), {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: formData,
    });

    if (!createResponse.ok) {
      throw new Error(`Failed to create shortlink. Status: ${createResponse.status}`);
    }

    const createdData = await createResponse.json();

    if (!createdData.data?.id) {
      throw new Error("Failed to retrieve the ID of the created shortlink.");
    }

    // Step 5: Fetch full details using the ID
    const fullDetailsResponse = await fetch(`${apiBaseUrl}${endPoints.links}/${createdData.data.id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!fullDetailsResponse.ok) {
      throw new Error(`Failed to fetch full details. Status: ${fullDetailsResponse.status}`);
    }

    const fullData = await fullDetailsResponse.json();
    return { success: true, data: fullData };
  } catch (error: any) {
    console.error("Error creating shortlink:", error.message);
    return { success: false, error: error.message };
  }
}
