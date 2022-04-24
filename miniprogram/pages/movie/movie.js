// pages/movie/movie.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        movieList: []
    },

    getMovieList() {
        wx.showLoading({
            title: '加载中',
        })
        wx.cloud.callFunction({
            name: 'movielist',
            data: {
                start: this.data.movieList.length,
                count: 10
            }
        }).then(res => {
            this.setData({
                movieList: this.data.movieList.concat(res.result.subject_collection_items)
            });
            wx.hideLoading()
        }).catch(err => {
            console.error(err);
            wx.hideLoading()
        })
    },

    gotoComment(event) {
        wx.navigateTo({
            url: `../comment/comment?movieid=${event.target.dataset.movieid}`,
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getMovieList()
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
        this.getMovieList();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})