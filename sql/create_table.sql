CREATE DATABASE IF NOT EXISTS dio_user_test;
USE dio_user_test;

-- 用户表
create table if not exists user
(
    id            bigint auto_increment              not null comment 'id',
    name          varchar(512)                       null comment '真实姓名',
    username      varchar(512)                       null unique comment '用户名',
    gender        tinyint  default 0                 not null comment '性别(0-保密,1-男,2-女)',
    age           int                                null comment '年龄',
    salt          varchar(256)                       not null comment '盐',
    password      varchar(256)                       not null comment '加盐双重md5结果',
    userStatus    tinyint  default 0                 not null comment '用户状态(0-可用,1-被封,2-管理员)',
    createTime    datetime default CURRENT_TIMESTAMP not null comment '创建时间',
    updateTime    datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    isDeleted     tinyint  default 0                 not null comment '是否删除(0-可用,1-删除)',
    primary key (id)
) comment '用户表';
