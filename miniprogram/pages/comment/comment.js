// pages/comment/comment.js
const db = wx.cloud.database(); // 初始化数据库
const _ = db.command

Page({
    /**
     * 页面的初始数据
     */
    data: {
        detail: {},
        content: '', // 评价的内容
        score: 5, // 评价的分数
        images: [], // 上传的图片
        fileIds: [],
        movieId: -1,
        oldComment: []
    },

    submit() {
        wx.showLoading({
            title: '评论中',
        })
        // 上传图片到云存储
        this.uploadImg().then(res => {
            // 插入数据
            db.collection('comment').add({
                data: {
                    content: this.data.content,
                    score: this.data.score,
                    movieid: this.data.movieId,
                    fileIds: this.data.fileIds
                }
            }).then(res => {
                wx.hideLoading();
                wx.showToast({
                    title: '评价成功',
                })
                setTimeout(() => {
                    this.setData({
                        content: '', // 评价的内容
                        score: 5, // 评价的分数
                        images: [], // 上传的图片
                        fileIds: []
                    })
                    this.getComment()
                }, 500)
            }).catch(err => {
                wx.hideLoading();
                wx.showToast({
                    title: '评价失败',
                })
            })
        });
    },

    updateComment() {
        wx.showLoading({
            title: '评论中',
        })
        // 上传图片到云存储
        this.uploadImg().then(res => {
            // 查找对应数据
            db.collection('comment').where({
                movieid: this.data.movieId
            }).update({
                data: {
                    content: this.data.content,
                    score: this.data.score,
                    fileIds: _.push(this.data.fileIds)
                }
            }).then(res => {
                wx.hideLoading();
                wx.showToast({
                    title: '更改评价成功',
                })
                setTimeout(() => {
                    this.setData({
                        content: '', // 评价的内容
                        score: 5, // 评价的分数
                        images: [], // 上传的图片
                        fileIds: []
                    })
                    this.getComment()
                }, 500)
            }).catch(err => {
                wx.hideLoading();
                wx.showToast({
                    title: '更改评价失败',
                })
            })
        });
    },

    deleteComment() {
        wx.showLoading({
            title: '删除中',
        })
        db.collection('comment').where({
            movieid: this.data.movieId
        }).remove().then(res => {
            wx.hideLoading();
            wx.showToast({
                title: '删除成功',
            })
            setTimeout(() => {
                this.getComment()
            }, 500)
        }).catch(err => {
            wx.hideLoading();
            console.log(err);
            wx.showToast({
                title: '删除失败',
            })
        })
    },

    onContentChange(event) {
        this.setData({
            content: event.detail
        });
    },

    onScoreChange(event) {
        this.setData({
            score: event.detail
        });
    },

    chooseImg() {
        // 选择图片
        wx.chooseImage({
            count: 9,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success: res => {
                // tempFilePath可以作为img标签的src属性显示图片
                const tempFilePaths = res.tempFilePaths
                this.setData({
                    images: this.data.images.concat(tempFilePaths)
                });
            }
        })
    },

    // 上传图片
    uploadImg() {
        let promiseArr = [];
        for (let i = 0; i < this.data.images.length; i++) {
            promiseArr.push(new Promise((reslove, reject) => {
                let item = this.data.images[i];
                let suffix = /\.\w+$/.exec(item)[0]; // 正则表达式，返回文件扩展名
                wx.cloud.uploadFile({
                    cloudPath: new Date().getTime() + suffix, // 上传至云端的路径
                    filePath: item, // 小程序临时文件路径
                    success: res => {
                        // 返回文件 ID
                        this.setData({
                            fileIds: this.data.fileIds.concat(res.fileID)
                        });
                        reslove();
                    },
                    fail: console.error
                })
            }));
        }
        return Promise.all(promiseArr)
    },

    getComment() {
        db.collection('comment').where({
            movieid: this.data.movieId
        }).get().then(res => {
            this.setData({
                oldComment: res.data
            })
        }).catch(err => {
            console.error(err);
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({
            movieId: options.movieid
        });
        wx.showLoading({
            title: '加载中',
        })
        wx.cloud.callFunction({
            name: 'getDetail',
            data: {
                movieid: options.movieid
            }
        }).then(res => {
            this.setData({
                detail: res.result
            });
            wx.hideLoading();
        }).catch(err => {
            console.error(err);
            wx.hideLoading();
        });
        this.getComment()
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})