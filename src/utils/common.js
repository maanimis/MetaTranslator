export const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

export async function extractTextBetweenElements(
  startSelector,
  endSelector,
  outputType = "innerText",
) {
  const startElement = await waitForElement(startSelector);
  const endElement = await waitForElement(endSelector);

  if (!startElement || !endElement) {
    console.log("One or both elements not found.");
    return "";
  }

  const range = document.createRange();
  range.setStartAfter(startElement);
  range.setEndBefore(endElement);
  // const text = range.toString().trim();
  // return text;

  const fragment = range.cloneContents();
  const tempContainer = document.createElement("div");
  tempContainer.appendChild(fragment);

  switch (outputType) {
    case "innerHTML":
      return tempContainer.innerHTML;
    case "innerText":
      return tempContainer.innerText;
    case "textContent":
      return tempContainer.textContent;
    default:
      console.log(
        "Invalid output type specified. Returning innerText by default.",
      );
      return tempContainer.innerText;
  }
}

export const isExpired = (ExpireDate) => {
  const timestamp = Math.floor(Date.now() / 1000).toString();
  return timestamp >= ExpireDate;
};

export function formatByte(size) {
  const ONE_KB = 1024;
  const ONE_MB = ONE_KB * 1024;
  const ONE_GB = ONE_MB * 1024;
  const ONE_TB = ONE_GB * 1024;
  const ONE_PB = ONE_TB * 1024;

  if (size < 0) {
    return "0 B";
  } else if (size < ONE_KB) {
    return size.toFixed(0) + " B";
  } else if (size < ONE_MB) {
    return (size / ONE_KB).toFixed(2) + " KB";
  } else if (size < ONE_GB) {
    return (size / ONE_MB).toFixed(2) + " MB";
  } else if (size < ONE_TB) {
    return (size / ONE_GB).toFixed(2) + " GB";
  } else if (size < ONE_PB) {
    return (size / ONE_TB).toFixed(2) + " TB";
  } else {
    return (size / ONE_PB).toFixed(2) + " PB";
  }
}
