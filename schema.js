const joi=require("joi");

module.exports.listingschema=joi.object({
    lists:joi.object({
        title:joi.string().required(),
        description:joi.string().required(),
        location:joi.string().required(),
        country:joi.string().required(),
        price:joi.number().required().min(0),
        image:joi.string().allow("",null),
    }).required(),

});
module.exports.reviewschema=joi.object({
    reviews:joi.object({
        rating:joi.number().min(1).max(5).required(),
        comment:joi.string().required(),
    }).required(),
});
