import { config } from "../config/config";

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: "new" | "read" | "replied" | "resolved";
  priority: "low" | "medium" | "high" | "urgent";
  adminNotes: string;
  createdAt: string;
  updatedAt: string;
  responseBy?: string;
  responseDate?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

class ContactService {
  private baseUrl = config.API_BASE_URL;

  // Public method - submit contact form
  async submitContactForm(data: ContactFormData): Promise<ContactMessage> {
    const response = await fetch(`${this.baseUrl}/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      let errorMessage = "Failed to submit contact form";

      // Check for rate limiting
      if (response.status === 429) {
        errorMessage = "יותר מדי בקשות. אנא המתן מעט לפני ניסיון נוסף";
        throw new Error(errorMessage);
      }

      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // If response is not JSON, use status text
        errorMessage = response.statusText || `HTTP ${response.status}`;
      }

      throw new Error(errorMessage);
    }

    const result = await response.json();
    return result.contact;
  }

  // Admin methods - require authentication
  async getAllContacts(
    token: string,
    filters?: { status?: string; priority?: string }
  ): Promise<ContactMessage[]> {
    const params = new URLSearchParams();
    if (filters?.status) params.append("status", filters.status);
    if (filters?.priority) params.append("priority", filters.priority);

    const url = `${this.baseUrl}/contact${
      params.toString() ? `?${params.toString()}` : ""
    }`;

    const response = await fetch(url, {
      headers: {
        "x-auth-token": token,
      },
    });

    if (!response.ok) {
      let errorMessage = "Failed to fetch contacts";

      // Check for rate limiting
      if (response.status === 429) {
        errorMessage = "Rate limited - too many requests";
        throw new Error(errorMessage);
      }

      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // If response is not JSON, use status text
        errorMessage = response.statusText || `HTTP ${response.status}`;
      }
      throw new Error(errorMessage);
    }

    const result = await response.json();
    return result;
  }

  async getContact(id: string, token: string): Promise<ContactMessage> {
    const response = await fetch(`${this.baseUrl}/contact/${id}`, {
      headers: {
        "x-auth-token": token,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch contact");
    }

    return response.json();
  }

  async updateContactStatus(
    id: string,
    status: string,
    token: string,
    adminNotes?: string
  ): Promise<ContactMessage> {
    const response = await fetch(`${this.baseUrl}/contact/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
      body: JSON.stringify({ status, adminNotes }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update contact status");
    }

    const result = await response.json();
    return result.contact;
  }

  async deleteContact(id: string, token: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/contact/${id}`, {
      method: "DELETE",
      headers: {
        "x-auth-token": token,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete contact");
    }
  }

  async updateContact(
    id: string,
    data: Partial<ContactMessage>,
    token: string
  ): Promise<ContactMessage> {
    const response = await fetch(`${this.baseUrl}/contact/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": token,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update contact");
    }

    const result = await response.json();
    return result.contact;
  }
}

export const contactService = new ContactService();
