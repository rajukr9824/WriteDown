const mongoose = require('mongoose')
const Blog=require('../models/blogModel')
const User = require('../models/userModel')

exports.getAllBlogsController=async(req, res)=>{
    try {
        const blogs=await Blog.find({}).populate('user')
            if(!blogs){
                return res.status(401).send({
                    success: false,
                    message:'No blogs found!'
                })
            }
            return res.status(200).send({
                success:true,
                BlogCount:blogs.length,
                message:'All blogs lists!',
                blogs
            })
        
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success:false,
            message:'Error while getting blogs!',
            error
        })
    }
}
exports.createBlogController=async(req, res)=>{
    try {
        const {title, description, image, user}=req.body
        if(!title || !description || !image || !user){
            return res.status(400).send({
                success:false,
                message:'Please provide all the required fields!'
            })
        }
        const existingUser=await User.findById(user)
        if(!existingUser){
             return res.status(404).send({
                success:false,
                message:'Unable to find user'
             })
        }
        const newBlog=new Blog({title, description, image, user})
        const session=await mongoose.startSession()
        session.startTransaction()
        await newBlog.save({session})
        existingUser.blogs.push(newBlog)
        await existingUser.save({session})
        await session.commitTransaction()
        await newBlog.save()
        return res.status(201).send({
            success:true,
            message:'Blog created successfully!',
            newBlog
        })
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success:false,
            message:'Error while creating blog!',
            error
        })
        
    }
}
exports.updateBlogController=async(req, res)=>{
    try {
        const {id}=req.params
        const {title, description, image}=req.body
        const blog=await Blog.findByIdAndUpdate(id, {...req.body}, {new:true})
        return res.status(200).send({
            success:true,
            message:'Blog updated successfully!',
            blog
        })
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success:false,
            message:'Error while updating blog',
            error
        })
        
    }
}
exports.getBlogByIdController=async( req, res)=>{
    try {
        const {id}=req.params
        const blog=await Blog.findById(id)
        if(!blog){
            return res.status(404).send({
                success:false,
                message:"Blog not found!"
            })
        }
        return res.status(200).send({
            success:true,
            message:'fetch single blog!',
            blog
        })
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success:false,
            message:'Error while getting blog!',
            error
        })
    }
}
exports.deleteBlogController=async(req,res)=>{
    try {
      const blog =  await Blog.findByIdAndDelete(req.params.id).populate("user")
      await blog.user.blogs.pull(blog)
      await blog.user.save()
        return res.status(200).send({
            success:true,
            message:'Blog deleted successfully!'
        })
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success:false,
            message:'Error while deleting blog',
            error
        })
    }
}

exports.userBlogController=async(req, res)=>{
    try {
        const userBlog=await User.findById(req.params.id).populate('blogs')
        if(!userBlog){
            return res.status(404).send({
                success:false,
                message:'blogs not find with this id'
            })
        }
        return res.status(200).send({
            success:true,
            message:'user blogs',
            userBlog
        })
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success:false,
            message:'error in user blog',
            error
        })
        
    }
}