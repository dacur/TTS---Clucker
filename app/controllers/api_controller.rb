require 'json'
require 'cluckdata.rb'

class ApiController < ApplicationController
	def savesignup
		first = params[:first]
		last = params[:last]
		email = params[:email]
		password = params[:password]

		p '1 : ' + first + ' | ' + last + ' | ' + email + ' | ' + password

		u = User.new(first: first, last: last, email: email, password: password) 

		if (u.valid?)
			u.save

			session[:user_id] = u.id.to_s
			session[:first] = u.first
			session[:last] = u.last

			render json: u
		else
			render json: nil
		end
	end

	def login
		email = params[:email]
		password = params[:password]

		p email + ' | ' + password

		u = User.find_by(email: email)

		if (u != nil && u.password == password)
			user_id = u.id.to_s
			
			session[:user_id] = user_id
			session[:first] = u.first
			session[:last] = u.last

			render json: user_id.to_json
		else
			render json: nil
		end
	end

	def logout
		# NON AJAX
		# reset_session
		# flash[:notice] = "Y'all come back now ya' here?"
		# redirect_to :root

		# AJAX
		reset_session
		head :ok
	end

	def savecluck
		text = params[:text].chomp

		user_id = session[:user_id]
		first = session[:first]
		last = session[:last]

		post_date = Time.now
		post_date.to_formatted_s(:short)         
		
		cd = CluckData.new(nil, user_id, first + ' ' + last, text, post_date)
		cd.save

		render json: cd
	end
end
