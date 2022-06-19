exports.allAccess = (req, res) => {
    res.status(200).json("Public content");
}

exports.userBoard = (req, res) => {
    res.status(200).json("User content");
}

exports.adminBoard = (req, res) => {
    res.status(200).json("Admin content");
}

exports.moderatorBoard = (req, res) => {
    res.status(200).json("Moderator content");
}
