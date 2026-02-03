import { z } from "zod";
import { insertUserSchema, insertTimeSlotSchema, insertBookingSchema, insertBlockedDateSchema, updateUserSchema } from "./schema.js";
const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional()
  }),
  notFound: z.object({
    message: z.string()
  }),
  internal: z.object({
    message: z.string()
  }),
  unauthorized: z.object({
    message: z.string()
  })
};
const api = {
  auth: {
    register: {
      method: "POST",
      path: "/api/register",
      input: insertUserSchema,
      responses: {
        201: z.custom(),
        400: errorSchemas.validation
      },
      output: z.any() // Returns user object
    },
    login: {
      method: "POST",
      path: "/api/login",
      input: z.object({ username: z.string(), password: z.string() }),
      responses: {
        200: z.custom(),
        401: errorSchemas.unauthorized
      }
    },
    logout: {
      method: "POST",
      path: "/api/logout",
      responses: {
        200: z.void()
      }
    },
    me: {
      method: "GET",
      path: "/api/user",
      responses: {
        200: z.custom(),
        401: errorSchemas.unauthorized
      }
    }
  },
  slots: {
    list: {
      method: "GET",
      path: "/api/slots",
      input: z.object({
        date: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional()
      }).optional(),
      responses: {
        200: z.array(z.custom())
      }
    },
    create: {
      method: "POST",
      path: "/api/slots",
      input: insertTimeSlotSchema,
      responses: {
        201: z.custom(),
        400: errorSchemas.validation,
        403: errorSchemas.unauthorized
      }
    },
    delete: {
      method: "DELETE",
      path: "/api/slots/:id",
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
        403: errorSchemas.unauthorized
      }
    }
  },
  bookings: {
    list: {
      method: "GET",
      path: "/api/bookings",
      responses: {
        200: z.array(z.custom()),
        403: errorSchemas.unauthorized
      }
    },
    create: {
      method: "POST",
      path: "/api/bookings",
      input: z.object({ slotId: z.string() }),
      responses: {
        201: z.custom(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized
      }
    },
    cancel: {
      method: "PATCH",
      path: "/api/bookings/:id/cancel",
      responses: {
        200: z.custom(),
        404: errorSchemas.notFound,
        403: errorSchemas.unauthorized
      }
    }
  },
  blockedDates: {
    list: {
      method: "GET",
      path: "/api/blocked-dates",
      responses: {
        200: z.array(z.custom())
      }
    },
    create: {
      method: "POST",
      path: "/api/blocked-dates",
      input: insertBlockedDateSchema,
      responses: {
        201: z.custom(),
        400: errorSchemas.validation,
        403: errorSchemas.unauthorized
      }
    },
    delete: {
      method: "DELETE",
      path: "/api/blocked-dates/:id",
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
        403: errorSchemas.unauthorized
      }
    }
  },
  users: {
    update: {
      method: "PATCH",
      path: "/api/user",
      input: updateUserSchema,
      output: z.any()
    }
  }
};
function buildUrl(path, params) {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
export {
  api,
  buildUrl,
  errorSchemas
};
