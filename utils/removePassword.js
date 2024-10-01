module.exports = async function removePassword(user) {
    if (!user) return null
    const { password, ...rest } = user;
    return rest
}