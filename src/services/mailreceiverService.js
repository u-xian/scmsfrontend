import http from "./httpService";
import auth from "../services/authService";

const apiEndpoint = "mailreceivers";

const config = { headers: { "x-auth-token": auth.getJwt() } };

const getMailreceiver = async (mailreceiverId) => {
  return await http.get(apiEndpoint + "/" + mailreceiverId, config);
};

const getMailreceivers = async () => {
  return await http.get(apiEndpoint, config);
};

const createMailreceiver = async (mailreceiver) => {
  return await http.post(apiEndpoint, mailreceiver, config);
};

const updateMailreceiver = async (mailreceiverId, mailreceiver) => {
  return await http.put(
    apiEndpoint + "/" + mailreceiverId,
    mailreceiver,
    config
  );
};

const updateStatusMailreceiver = async (mailreceiverId, mailreceiver) => {
  return await http.put(
    apiEndpoint + "/updatestatus/" + mailreceiverId,
    mailreceiver,
    config
  );
};

const deleteMailreceiver = async (mailreceiverId) => {
  return await http.delete(apiEndpoint + "/" + mailreceiverId, config);
};

const mailreceiverService = {
  getMailreceiver,
  getMailreceivers,
  createMailreceiver,
  updateMailreceiver,
  updateStatusMailreceiver,
  deleteMailreceiver,
};

export default mailreceiverService;
