import { IDomain } from "./interfaces.dom";

export class DomainParser {
  // Static method implementation
  static parse(urlString: string = location.href): IDomain {
    const url = new URL(urlString);
    const parts = url.hostname.split(".");

    const domainRaw = parts.slice(-2).join(".");
    const nameRaw = parts.includes("www") ? parts[1] : parts[0];

    const domain = domainRaw.toLocaleLowerCase();
    const name = nameRaw.toLocaleLowerCase();

    return { domain, name };
  }
}
