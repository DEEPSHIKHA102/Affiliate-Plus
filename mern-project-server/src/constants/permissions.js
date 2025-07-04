const permissions = {
    admin: [
        'link:create',
        'link:update',
        'link:delete',
        'link:read',
        'user:read',
        'user:delete',
        'user:create',
        'user:update',
        'payment:create',

    ],
    developer: [
        'link:read',
    ],
    viewer: [
        'link:read',
        'user:read',
    ]
};

module.exports = permissions;