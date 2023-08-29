package com.base.bean;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import java.io.Serializable;
import java.util.Date;
import com.baomidou.mybatisplus.annotation.TableField;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;


@Getter
@Setter
@ToString
public class Doctor implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键
     */
    @TableId(value = "id", type = IdType.AUTO)
    @TableField(value = "id")
    private Long id;

    /**
     * 唯一医疗号
     */
    @TableField(value = "job_number")
    private String jobNumber;

    /**
     * 邮箱
     */
    @TableField(value = "email")
    private String email;

    /**
     * 密码
     */
    @TableField(value = "password")
    private String password;

    /**
     * 姓名
     */
    @TableField(value = "real_name")
    private String realName;

    /**
     * 联系信息
     */
    @TableField(value = "contact_information")
    private String contactInformation;

    /**
     * 是否预约
     */
    @TableField(value = "appointment")
    private Boolean appointment;

    /**
     * 备注信息
     */
    @TableField(value = "remark")
    private String remark;

    /**
     * 科室
     */
    @TableField(value = "departments")
    private String departments;

    /**
     * 创建时间
     */
    @TableField(value = "create_time")
    private Date createTime;

    /**
     * 更新时间
     */
    @TableField(value = "update_time")
    private Date updateTime;


}
