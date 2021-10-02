const Router = require("express").Router;
const router = Router();
const Ticket = require("../Controller/HelpDesk");

router.post("/add_ticket", Ticket.AddTicket);

router.get("/get_tickets", Ticket.GetTickets);

router.get("/get_ticket/", Ticket.GetTicket);

router.delete("/delete_tcket/", Ticket.DeleteTicket);

router.post("/send_reply", Ticket.SendReply);

module.exports = router;
