// match string in word that begin with A-Z
/([A-Z])\w+/g;

// match string that begin with '%' and has 2 character in 0-9 and A-Z
/(%[0-9A-Z]{2})+/g;

// match string look email like
/^[\w-.]+@[\w-.]+/gm;

// match start of string that contain open '{' or '['
/^[\{\[]/;

// match all open '{' or '['
/[\{\[]/;

    // match string that begin with '%' and value is one in group
/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g;

// match open '(' or ')'
/[\(\)]/g;