const permissions = {
    admin: [
        'link:create',
        'user:read',
        'link:update',
        'user:delete',
        'link:create',
        'user:read',
        'link:update',
        'user:delete',
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