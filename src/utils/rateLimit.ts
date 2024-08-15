import { rateLimit } from 'express-rate-limit'

const limiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 minutes
	limit: 50, // Limit each IP to 50 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
})

export default limiter;