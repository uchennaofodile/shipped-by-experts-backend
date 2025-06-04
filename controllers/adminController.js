// Handles admin dashboard logic
exports.listUsers = (req, res) => {
  // TODO: List all users
  res.json({ message: 'List of users' });
};

exports.listShipments = (req, res) => {
  // TODO: List all shipments
  res.json({ message: 'List of shipments' });
};

exports.listPayments = (req, res) => {
  // TODO: List all payments
  res.json({ message: 'List of payments' });
};

exports.getStats = (req, res) => {
  // TODO: Provide dashboard stats
  res.json({ message: 'Dashboard stats' });
};
