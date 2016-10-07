import React from 'react'
import * as enzyme from 'enzyme';
import jasmineEnzyme from 'jasmine-enzyme'
import $ from 'jquery';

import {CommentsComponent} from './../src/view/Comments'

describe("Comments Widget", () => {
    var singleCommentJSON
    var getURL = 'http://localhost/react-comments/comments.php'

    beforeEach(() => {
        jasmine.Ajax.install()
        jasmineEnzyme()
        singleCommentJSON = {id: 1, msg: "First Comment", user: "Naresh", updatedOn: "2014-09-19T15:28:46.493Z", likes: 1}
    })

    it("Should give a nice message when there are no comments", () => {
        var comments = enzyme.mount(<CommentsComponent comments={[]}/>)
        expect(comments.find('div.empty')).toBePresent()
        expect(comments.find('div.empty')).toHaveText('Be the first one to comment...')
    })

    it("Should add single comment as a div from passed in json", () => {
        var comments = enzyme.mount(<CommentsComponent comments={[singleCommentJSON]} loggedInUser="Dhaval"/>)
        expect(comments.find('div.comment')).toBePresent()
        expect(comments.find('div.comment').length).toBe(1)
        expect(comments.find('div.comment div.comment-header')).toHaveText('Naresh1 Likes')
        expect(comments.find('div.comment div.comment-body')).toHaveText('First Comment')
    })

    it("Should display the most recent comments on top", () => {
        var data = [singleCommentJSON,
            {id: 2, msg: "Second Comment", user: "James", updatedOn: "2014-06-19T15:28:46.493Z", likes: 1},
            {id: 3, msg: "Third Comment", user: "Jack", updatedOn: "2014-12-19T15:28:46.493Z", likes: 1}]
        var comments = enzyme.mount(<CommentsComponent comments={data} loggedInUser="Dhaval"/>)
        expect(comments.find('div.comment').length).toBe(data.length)
        expect(comments.find('div.comment div.comment-header').first()).toHaveText('Jack1 Likes')
        expect(comments.find('div.comment div.comment-header').last()).toHaveText('James1 Likes')
    })

    it("Should not display private comments to other logged in user", () => {
        singleCommentJSON.private = true
        var comments = enzyme.mount(<CommentsComponent comments={[singleCommentJSON]} loggedInUser="Dhaval"/>)
        expect(comments.find('div.comment').length).toBe(0)
        expect(comments.find('div.empty')).toHaveText('Be the first one to comment...')
    })

    it("Should not display private comments to public", () => {
        singleCommentJSON.private = true
        var comments = enzyme.mount(<CommentsComponent comments={[singleCommentJSON]} loggedInUser=""/>)
        expect(comments.find('div.comment').length).toBe(0)
        expect(comments.find('div.empty')).toHaveText('Be the first one to comment...')
    })

    it("Should display private comments to author", () => {
        singleCommentJSON.private = true
        var comments = enzyme.mount(<CommentsComponent comments={[singleCommentJSON]} loggedInUser="Naresh"/>)
        expect(comments.find('div.comment').length).toBe(1)
        expect(comments.find('div.comment div.comment-header')).toHaveText('Naresh1 Likes')
    })

    it("Should fetch data from URL and display comments", () => {
        var expectedAjaxResponse = [
            singleCommentJSON,
            {id: 2, msg: "Second Comment", user: "James", updatedOn: "2014-06-19T15:28:46.493Z"},
            {id: 3, msg: "Third Comment", user: "Jack", updatedOn: "2014-12-19T15:28:46.493Z"}
        ]

        jasmine.Ajax.stubRequest(getURL).andReturn({
            status: 200,
            statusText: 'HTTP/1.1 200 OK',
            contentType: 'application/jsoncharset=UTF-8',
            responseText: JSON.stringify(expectedAjaxResponse)
        })

        var comments = enzyme.mount(<CommentsComponent sourceUrl={getURL} loggedInUser="Naresh"/>)
        setTimeout(() => {
            expect(comments.find('div.comment').length).toBe(expectedAjaxResponse.length)
            expect(comments.find('div.comment div.comment-header').first()).toHaveText('Jack1 Likes')
            expect(comments.find('div.comment div.comment-header').last()).toHaveText('James1 Likes')
        }, 1000)
    })

    it("Should try to fetch data from URL and display error message when unsuccessful", () => {
        spyOn($, 'ajax').and.callFake(function (url) {
            var ajaxMock = $.Deferred()
            switch (url) {
                case undefined:
                    ajaxMock.resolve({
                        'error': 'Please use GET request'
                    })
                    break
                case getURL:
                    ajaxMock.resolve({
                        status: 400,
                        statusText: 'HTTP/1.1 400 Bad Request',
                        contentType: 'application/jsoncharset=UTF-8',
                        responseText: ''
                    })
                    break
                default:  // invalid url
                    ajaxMock.reject()
            }
            return ajaxMock.promise()
        })

        var comments = enzyme.mount(<CommentsComponent sourceUrl={getURL} loggedInUser="Naresh"/>)
        expect(comments.find('div.comment').length).toBe(0)
        expect(comments.find('div.error')).toBePresent()
        expect(comments.find('div.error')).toHaveText('Failed to fetch comments from URL...')
    })

    afterEach(() => {
        jasmine.Ajax.uninstall()
    })
})
