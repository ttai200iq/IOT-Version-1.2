export const host = {
    AUTH: process.env.REACT_APP_AUTH,
    ClOUD: process.env.REACT_APP_CLOUD,
    RMCLOUD: process.env.REACT_APP_RMCLOUD,
    DEVICE: process.env.REACT_APP_DEVICE,
    TIME: process.env.REACT_APP_TIME,
};


export const messages = {
    en: {
        username: "Username",
        password: 'Password',
        login: 'Login',

        create_note: 'Already have an account?',
        create_note2: 'Not a member?',
        create_new: 'Signup',

        Controller: "Controller",
        headSerial: "Serial Number",
        device: "Device",
        version: "Version",
        version_app: "Version: 1.0",
        newversion: "New Version",
        updating: "Updating...!",
        alert_1: "Please fill out information!",
        alert_2: "This serial number does not exist or is already in use!",

        Dashboard: "Dashboard",
        Log: "Logs",
        Map: "Map",


        tab1: 'Water factory',
        tab2: 'Solar systems',
        tab3: 'Valve systems',
        tab4: 'Elevator',

        Sensor: "Sensor",
        type: 'Type',
        memory: 'Memory',
        auto: 'Auto',
        effect_1: 'Basic',
        effect_2: 'Random',
        effect_3: 'Chase',
        effect_4: 'Star',
        effect_5: 'Pendulum',
        effect_6: 'Twinkle',
        effect_7: 'Colorfill',
        effect_8: 'Rainbow',
        autoColor: 'Auto Color',
        autoLight: 'Auto Light',
        color: 'Color',
        light: 'Light',
        effect: 'Effect',




        Time: "Time",
        all: "All",
        button: "Button",
        mode: "Mode",
        on: "ON",
        off: "OFF",
        loop: "Loop",
        begin: "Begin",
        end: "End",
        days: "Days",
        sunday: "Sd",
        alert_3: "Clear time setting successful!",
        alert_4: "Restart time setting successful!",
        alert_5: "Set expiration time!",
        alert_6: "Set expiration time!",

        Setting: "Setting",
        rename: 'Rename button',
        renamess: 'Rename sensor',
        buttonname: 'Button name',
        sensorname: 'Sensor name',
        modeClock: 'Stopwatch',
        max: 'Up to',
        second: 'seconds',
        times: 'times',
        modeDatetime: 'Date and Time',
        select: 'Choose days',
        add: 'Add',
        remove: 'Delete',
        changePass: 'Change password',
        mail: 'Your mail',
        curpass: 'Current password',
        newpass: 'New password',
        aupass: 'Confirm new password',
        lang: 'Language',
        firebase: "Firebase",
        config: "Device configuration",
        fbcreate: "Add device",
        fbdelete: "Delete device",
        fbwarn: 'Warning config',
        fbunit: 'Change unit',
        sensor: "Sensor configuration",
        enable: "Enable",
        disable: "Disable",
        infor: "DAT GROUP information",
        service: "Service pack",
        product: "Product",
        warn: "WARN",
        min_: "MIN: ",
        max_: "MAX: ",
        unit: "Unit",
        logout: 'Logout',
        save: 'Save',

        fbnotefirst: "Notification!",
        fbnote: "Currently you cannot use this feature on the Limited package, please contact SmartTech to renew the Premium package.",
        fbnoteend: "Thank you.",

        enddate: "Expiration date",

        alert_7: "Button rename successful!!",
        alert_8: "Serial number and button incorrect!",
        alert_9: "Setup successfully!",
        alert_10: "The serial number is not in your account!",
        alert_11: "This button does'nt have in this serial number!",
        alert_12: "This button is already in use!",
        alert_13: "Error!",
        alert_14: "Please choose another time period!",
        alert_15: "Only 5 timeframes can be saved!",
        alert_16: "Please select the time!",
        alert_17: "The end date must be the next or the same as the begin date!",
        alert_18: "The begin/end date must be the next or the same as the current date!",
        alert_19: "The on/off time and date cannot be blank!",
        alert_20: "Incorrect mail format!",
        alert_21: "Incorrect mail or password!",
        alert_22: "The confirmation password is incorrect!",
        alert_23: "The new password must be different from the current password!",
        alert_24: "Change language successfully!",
        alert_25: "Username or password incorrect!",
        alert_26: "You have successfully started Firebase, please follow SmartTech's variable usage guidelines",
        alert_27: "You have disabled Firebase feature on SmartTech.",
        alert_28: "Firebase update successful!",
        alert_29: "This ID is already in use!",
        alert_30: "This ID added to your Firebase!",
        alert_31: "Rename complete!",
        alert_32: "This ID does not exist in your Firebase!",
        alert_33: "Failed,this position does not exist on this ID!",
        alert_34: "Wait! SmartTech realizes you don't have any devices yet!",
        alert_35: "Wait! SmartTech detects your data has been corrupted!",
        alert_36: "This ID has been removed from your Firebase!",
        alert_37: "Warning update successful!",
        alert_38: "Successful unit change!",
        alert_39: "You can't use this email!",
        alert_40: "You can't use this username!",
        alert_41: "You have successfully submitted your registration request, please access your email to confirm your Smart Tech account registration!",
        alert_42: "The system ERROR, please try again in a few minutes!",
        alert_44: "please set another number!",
        alert_45: "add device successfull!",
        alert_46: "remove device successfull!",

        verify_1: "You have successfully verified your email!",
        verify_2: "This email verification link ERROR!",
        verify_3: "This email verification link has expired!",
        verify_4: "This email verification link is no longer available!",
        alert_43: "Updating...!",
        alert_53: "Update failed!",
        alert_54: "Update successful!",

    },
    vi: {
        username: "Tên tài khoản",
        password: 'Mật khẩu',
        login: 'Đăng nhập',

        create_note: 'Đã có tài khoản?',
        create_note2: 'Chưa có tài khoản?',
        create_new: 'Đăng ký',

        Controller: "Điều Khiển",
        headSerial: "Mã Thiết bị",
        device: "Thiết bị",
        version: "Phiên bản",
        version_app: "Phiên bản: 1.0",
        newversion: "Phiên bản mới",
        updating: "Đang cập nhật...!",
        alert_1: "Vui lòng nhập thông tin!",                                                                 //using
        alert_2: "Lỗi Thuật toán vui lòng kiểm tra lại!",                                                     //using

        Dashboard: "Dashboard",
        Log: "Lịch sử",
        Map: "Vị trí",

        tab1: 'Nhà máy nước',
        tab2: 'Năng lượng mặt trời',
        tab3: 'Hệ thống van',
        tab4: 'Thang máy',

        Sensor: "Cảm biến",
        type: 'Loại',
        memory: 'Bộ nhớ',
        auto: 'Tự động',
        effect_1: 'Cơ bản',
        effect_2: 'Ngẫu nhiên',
        effect_3: 'Rượt đuổi',
        effect_4: 'Ngôi sao',
        effect_5: 'Con lắc đơn',
        effect_6: 'Lấp lánh',
        effect_7: 'Tô màu',
        effect_8: 'Cầu vòng',
        autoColor: 'Màu tự động',
        autoLight: 'Độ sáng tự động',
        color: 'Màu',
        light: 'Sáng',
        effect: 'Hiệu ứng',

        Time: "Thời gian",
        all: "Toàn bộ",
        button: "Công tắc",
        mode: "Chế độ",
        on: "BẬT",
        off: "TẮT",
        loop: "Vòng lặp",
        begin: "Bắt đầu",
        end: "Kết thúc",
        days: "Thứ",
        sunday: "Cn",
        alert_3: "Không thành công, vui lòng thực hiện lại!",                                                                     //using
        alert_4: "Bạn có thể sử dụng thuật toán này!",                                               //using
        alert_5: "Thiết lập thành công!",                                                        //using
        alert_6: "Xóa màn hình thành công!",                                                         //using

        Setting: "Cài đặt",
        rename: 'Đổi tên công tắc',
        renamess: 'Đổi tên cảm biến',
        buttonname: 'Tên công tắc',
        sensorname: 'Tên cảm biến',
        modeClock: 'Cấu hình thiết bị',
        max: 'Tối đa',
        second: 'giây',
        times: 'lần',
        modeDatetime: 'Ngày và giờ',
        select: 'Chọn ngày',
        add: 'Thêm',
        remove: 'Xóa',
        changePass: 'Đổi mật khẩu',
        mail: 'Mail của bạn',
        curpass: 'Mật khẩu hiện tại',
        newpass: 'Mật khẩu mới',
        aupass: 'Xác nhận mật khẩu mới',
        lang: "Ngôn ngữ",
        firebase: "Firebase",
        config: "Cấu hình thiết bị",
        fbcreate: "Thêm thiết bị",
        fbdelete: "Xóa thiết bị",
        fbwarn: 'Thiết lập cảnh báo',
        fbunit: 'Đổi đơn vị',
        sensor: "Cấu hình cảm biến",
        enable: "Kích hoạt",
        disable: "Vô hiệu hóa",
        infor: "Thông tin DAT GROUP",
        service: "Gói dịch vụ",
        product: "Sản phẩm",
        warn: "Cảnh báo",
        min_: "Mức thấp: ",
        max_: "Mức cao: ",
        unit: "đơn vị",
        logout: 'Đăng xuất',
        save: 'Lưu',

        fbnotefirst: "Thông báo!",
        fbnote: "Hiện tại bạn chưa thể sử dụng tính năng này trên gói Limited, vui lòng liên hệ SmartTech để gia hạn gói Premium.",
        fbnoteend: "Xin cảm ơn.",

        enddate: "Ngày hết hạn",

        alert_7: "Thêm Màn hìn thành công!",                                                         // using
        alert_8: "Thanh ghi này không tồn tại bạn hãy kiểm tra lại!",                                // using
        alert_9: "Xóa tài khoản thành công!",                                                                    //using
        alert_10: "Tài khoản này đã được dùng!",                                                         //using
        alert_11: "Mail này đã được dùng!",                                                              //using
        alert_12: "Tạo tài khoản thành công!",                                                           //using
        alert_13: "Thiết lập lỗi!",                                                                       //using                
        alert_14: "Vui lòng chọn tên khác!",                                                            //using
        alert_15: "Lưu vào kho thành công!",                                                             //using
        alert_16: "Gỡ thiết bị thành công!",                                                             //using
        alert_17: "Gỡ dự án thành công!",                                                                //using
        alert_18: "Xóa dự án thành công!",                                                               //using
        alert_19: "Đang cập nhật..!",                                                            //using
        alert_20: "Nhập sai, lỗi nhập liệu!",                                                          //using
        alert_21: "Mail hoặc mật khẩu không đúng!",                                                  //using
        alert_22: "Mật khẩu xác nhận không đúng!",                                                   //using
        alert_23: "Mật khẩu mới bắt buộc phải khác Mật khẩu hiện tại!",                              //using
        alert_24: "Thay đổi mật khẩu thành công!",                                                   //using
        alert_25: "Tối đa là 4!",                                                                    //using
        alert_27: "Xóa giao diện thành công!",                                                           //using
        alert_28: "Không thể xóa!",                                                                   //using
        alert_29: "Tài khoản hoặc mật khẩu không đúng!",                                                 //using
        alert_30: "Vị trí mà bạn nhập không  được tìm thấy!",                                       //using
        alert_31: "Không tìm thấy file!",                                                       //using
        alert_32: "ID này không tồn tại!",
        alert_33: "Không tìm thấy cấu hình lỗi của thiết bị này trên tài khoản của bạn!",          //using                                                   //using
        alert_34: "Không tìm thấy dữ liệu, bạn vui lòng cấu hình lại!",                             //using
        alert_35: "Mật khẩu xác nhận không đúng!",                                                    //using
        alert_36: "Bạn vui lòng vào email của bạn để xác nhận đổi mật khẩu mới!",                  //using
        alert_37: "Tạo dự án thành công!",                                                   //using
        alert_38: "Dự án này đã được tạo!",                                                  //using
        alert_39: "Email này không có trên hệ thống!",                                          //using
        alert_40: "Thêm thiết bị thành công!",                                               //using
        alert_41: "Mã này đã được sử dụng, vui lòng nhập mã khác!",                                            //using
        alert_42: "Phiên giám sát đã hết hạn!",                                           //using
        alert_43: "Thêm dự án thành công!",                                               //using
        alert_44: "Dự án này đã được dùng!",                                            //using
        alert_45: "Dự án này không tồn tại!",                                              //using
        alert_46: "Không tìm thấy thiết bị này!",                                            //using
        alert_47: "Hãy chọn lại khung ngày phù hợp!",                                              //using
        alert_48: "Hãy chọn tháng bạn muốn xuất báo cáo!",                                              //using
        alert_49: "Hãy chọn ngày bạn muốn xuất báo cáo!",                                              //using
        alert_50: "Thiết bị này không được tìm thấy!",                                              //using
        alert_53: "Lưu thành công!",
        alert_54: "Lưu không thành công!",
        tit1: "IOT Tool",
        content1: "Chúng tôi nhận thấy một sự cố từ thiết bị này mà bạn đang dùng",

        verify_1: "Bạn đã xác minh thành công email của mình!",
        verify_2: "Liên kết xác minh email này LỖI!",
        verify_3: "Liên kết xác minh email này đã hết hạn!",
        verify_4: "Liên kết xác minh email này đã hết hiệu lực!",

    }
}
