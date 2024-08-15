import { STRIPE } from "../helper/constants";
import Stripe from "stripe";

const stripe = new Stripe(STRIPE.SECRECT);

export default stripe;
